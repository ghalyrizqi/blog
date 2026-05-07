type TypeMixProps = {
  first: string;
  rest: string;
  firstClassName?: string;
  className?: string;
};

export function TypeMix({ first, rest, firstClassName = '', className = '' }: TypeMixProps) {
  return (
    <span className={`inline-flex items-baseline gap-0.5 ${className}`}>
      <span className={`font-manufacturing leading-none ${firstClassName}`}>{first}</span>
      <span className="font-montserrat">{rest}</span>
    </span>
  );
}
