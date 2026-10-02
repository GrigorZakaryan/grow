import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const timeZone = searchParams.get("timeZone");

    if (!timeZone) {
      return new NextResponse("Missing timeZone", {
        status: 400,
      });
    }

    // Validate timezone
    try {
      Intl.DateTimeFormat("en-US", {
        timeZone,
      });
    } catch {
      return new NextResponse("Invalid timezone", {
        status: 400,
      });
    }

    const now = new Date();

    const today = formatInTimeZone(now, timeZone, "yyyy-MM-dd");

    const startOfToday = fromZonedTime(`${today} 00:00:00`, timeZone);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setUTCDate(startOfYesterday.getUTCDate() - 1);

    const checkboxTasks = await db.task.findMany({
      where: {
        countType: "CHECKBOX",
      },
      include: {
        activity: {
          where: {
            date: {
              gte: startOfYesterday,
              lt: startOfToday,
            },
          },
        },
      },
    });

    await Promise.all(
      checkboxTasks.map(async (task) => {
        if (task.activity.length === 0) {
          await db.task.update({
            where: { id: task.id },
            data: { streakDays: 0 },
          });
        }
      }),
    );

    /*
     * Reset repeating tasks that haven't been reset today.
     *
     * A task is considered outdated when:
     *
     *   lastResetAt < startOfToday
     *
     * or it has never been reset.
     */
    await db.task.updateMany({
      where: {
        type: "REPEATING",

        OR: [
          {
            lastResetAt: null,
          },
          {
            lastResetAt: {
              lt: startOfToday,
            },
          },
        ],
      },

      data: {
        qty: null,
        timeMS: null,
        checked: false,
        status: "UPCOMING",
        lastResetAt: now,
      },
    });

    const tasks = await db.task.findMany({
      where: {
        status: {
          in: ["UPCOMING", "IN_PROGRESS", "DONE"],
        },
        frequency: {
          in: ["DAILY"],
        },
      },
      orderBy: {
        startTime: "asc",
      },
      include: { domain: true },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);

    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
};
