export function formatNumber(number) {
  const numberFormatter = new Intl.NumberFormat("ua-UK", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedNumber = numberFormatter.format(number / 100);

  return formattedNumber;
}
