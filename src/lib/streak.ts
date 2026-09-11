import { prisma } from "./prisma";

/**
 * Updates a user's journaling streak upon creating a new journal entry.
 * Checks date differences in UTC / local date.
 */
export async function updateUserStreak(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  isNewMilestone: boolean;
  milestoneDays?: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = await prisma.streak.findUnique({
    where: { userId },
  });

  if (!streak) {
    streak = await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastEntryDate: new Date(),
      },
    });

    return {
      currentStreak: 1,
      longestStreak: 1,
      isNewMilestone: false,
    };
  }

  const lastDate = streak.lastEntryDate ? new Date(streak.lastEntryDate) : null;
  if (lastDate) {
    lastDate.setHours(0, 0, 0, 0);
  }

  const diffDays = lastDate
    ? Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  let newCurrent = streak.currentStreak;

  if (diffDays === 0) {
    // Already journaled today! Streak remains the same.
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      isNewMilestone: false,
    };
  } else if (diffDays === 1) {
    // Journaled yesterday -> consecutive streak +1
    newCurrent += 1;
  } else {
    // Missed a day or first time -> streak resets to 1
    newCurrent = 1;
  }

  const newLongest = Math.max(newCurrent, streak.longestStreak);

  await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastEntryDate: new Date(),
    },
  });

  // Check milestones: 7, 14, 30, 60, 100 days
  const milestones = [7, 14, 30, 60, 100, 365];
  const isMilestone = milestones.includes(newCurrent);

  if (isMilestone) {
    await prisma.notification.create({
      data: {
        userId,
        type: "STREAK_MILESTONE",
        message: `Keren banget! Kamu berhasil mencapai streak journaling ${newCurrent} hari berturut-turut! Tetap rawat kesehatan mentalmu ya.`,
      },
    });
  }

  return {
    currentStreak: newCurrent,
    longestStreak: newLongest,
    isNewMilestone: isMilestone,
    milestoneDays: isMilestone ? newCurrent : undefined,
  };
}
