import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    // adapter: PrismaAdapter(db), // Not needed for Credentials only
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            id: "impersonation",
            name: "Impersonation",
            credentials: {
                adminId: { label: "Admin ID", type: "text" },
                targetUserId: { label: "Target User ID", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.adminId || !credentials?.targetUserId) return null

                // Verify admin existence and role
                const admin = await db.user.findUnique({ where: { id: credentials.adminId } })
                // @ts-ignore: role exists
                if (!admin || admin.role !== 'SUPER_ADMIN') return null

                // Find target user
                const targetUser = await db.user.findUnique({ where: { id: credentials.targetUserId } })
                if (!targetUser) return null

                return {
                    id: targetUser.id,
                    name: targetUser.name,
                    email: targetUser.email,
                    image: targetUser.avatar,
                    // @ts-ignore
                    role: targetUser.role,
                    impersonatorId: admin.id
                }
            }
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Start Using WaFiz",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await db.user.findUnique({
                    where: {
                        email: credentials.email.toLowerCase()
                    }
                })

                if (!user) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.avatar,
                    // @ts-ignore
                    role: user.role,
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
                session.user.role = token.role
                if (token.impersonatorId) {
                    session.user.impersonatorId = token.impersonatorId
                }
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                if (user.impersonatorId) {
                    token.impersonatorId = user.impersonatorId
                }
            }
            return token
        }
    },
    pages: {
        signIn: '/login',
        error: '/error'
    }
}
