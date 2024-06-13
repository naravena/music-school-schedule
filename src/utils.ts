export const getCurrentWeek = (): { start: string, end: string } => {
    const now = new Date();
    const start = new Date(now.setDate(now.getDate() - now.getDay()));
    const end = new Date(now.setDate(now.getDate() + 6));
  
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
    return {
      start: formatDate(start),
      end: formatDate(end),
    };
  };
  