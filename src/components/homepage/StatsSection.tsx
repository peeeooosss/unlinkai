"use client";

const stats = [
  { value: "15,000+", label: "Students Placed" },
  { value: "500+", label: "Partner Universities" },
  { value: "98%", label: "Visa Success Rate" },
  { value: "50+", label: "Countries" },
];

export function StatsSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-blue-700 to-blue-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${index < stats.length - 1 ? "lg:border-r lg:border-white/15" : ""}`}
            >
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2" style={{ lineHeight: 1 }}>
                {stat.value}
              </div>
              <div className="text-sm text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
