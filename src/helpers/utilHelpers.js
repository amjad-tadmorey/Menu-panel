export function formateDate(isoString) {
  const d = new Date(isoString);

  if (isNaN(d)) return ''; // handle invalid date

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // convert 0 to 12 for 12 AM/PM clock
  const hoursStr = String(hours).padStart(2, '0');

  return `${year}/${month}/${day} - ${hoursStr}:${minutes} ${ampm}`;
}
