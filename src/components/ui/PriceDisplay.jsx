import { formatPriceFrom } from '../../utils/formatters';

export default function PriceDisplay({ usd, className = '', layout = 'inline', tzsClassName = '' }) {
  const price = formatPriceFrom(usd);
  if (!price) return null;

  if (layout === 'stack') {
    return (
      <span className={className}>
        <span className="block leading-tight">{price.usd}</span>
        <span className={`block text-[10px] leading-tight mt-0.5 opacity-80 ${tzsClassName}`}>
          {price.tzs}
        </span>
      </span>
    );
  }

  return <span className={className}>{price.inline}</span>;
}
