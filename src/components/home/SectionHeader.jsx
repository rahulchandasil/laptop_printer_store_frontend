function SectionHeader({ eyebrow, title, description, align = "left" }) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          {eyebrow}
        </span>
      ) : null}

      <div className="max-w-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>

        {description ? (
          <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default SectionHeader;
