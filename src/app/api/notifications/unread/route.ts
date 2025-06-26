// app/api/notifications/unread/route.ts
import { NextResponse } from "next/server";

import { getUser } from "@/lib/auth/auth-session";
import { PrismaClient } from "@/lib/generated/prisma";


export async function GET() {
    try {
        const prisma = new PrismaClient();
        const user = await getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unreadCount = await prisma.notification.count({
            where: {
                userId: user.id,
                read: false,
            },
        });

        return NextResponse.json({ hasUnread: unreadCount > 0 });
    } catch (error) {
        console.error("Error fetching unread notifications:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
