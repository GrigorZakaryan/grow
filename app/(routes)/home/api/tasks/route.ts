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

    // Today's date in the user's timezone
    const today = formatInTimeZone(now, timeZone, "yyyy-MM-dd");

    // Midnight at the beginning of today in the user's timezone
    const startOfToday = fromZonedTime(`${today} 00:00:00`, timeZone);

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
          in: ["UPCOMING", "IN_PROGRESS"],
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);

    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
};
