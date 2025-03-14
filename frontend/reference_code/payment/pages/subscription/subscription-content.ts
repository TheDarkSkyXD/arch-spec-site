interface Feature {
  id: number;
  title: string;
  icon: string;
  description: string;
}

export const subscriptionContent: Feature[] = [
  {
    id: 1,
    title: 'Happiness Missions',
    icon: 'assets/icons/subscription/subscription_missions.svg',
    description: 'Complete fun missions designed to boost your happiness.',
  },
  {
    id: 2,
    title: 'Mood Tracking',
    icon: 'assets/icons/subscription/subscription_mood.svg',
    description: 'Track your mood daily and see how it evolves over time.',
  },
  {
    id: 3,
    title: 'Journal',
    icon: 'assets/icons/subscription/subscription_journal.svg',
    description:
      'Keep a personal journal to reflect on your thoughts and feelings.',
  },
  {
    id: 4,
    title: 'Advanced AI Analysis',
    icon: 'assets/icons/subscription/subscription_ai.svg',
    description:
      'Benefit from advanced AI-driven insights to improve your happiness.',
  },
];
