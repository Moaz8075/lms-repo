export function getGreeting(firstName: string): string {
  const hour = new Date().getHours();

  if (hour < 12) return `Good Morning, ${firstName}`;
  if (hour < 17) return `Good Afternoon, ${firstName}`;
  return `Good Evening, ${firstName}`;
}

export function formatHeaderDate(date = new Date()): string {
  return date
    .toLocaleDateString('en-PK', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase();
}
