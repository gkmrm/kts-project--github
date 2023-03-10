const getFormatDate = (date: Date) => {
  return new Date(date)
    .toLocaleDateString('en-EN', {
      day: 'numeric',
      month: 'short',
    })
    .split(' ')
    .reverse()
    .join(' ');
};

export default getFormatDate;
