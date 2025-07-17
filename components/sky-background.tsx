"use client"

export function SkyBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 30%, #81d4fa 70%, #4fc3f7 100%)",
        }}
      />

      {/* Animated clouds with better positioning */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-16 bg-white rounded-full blur-sm animate-float" />
        <div className="absolute top-32 right-20 w-24 h-12 bg-white rounded-full blur-sm animate-float-delayed" />
        <div className="absolute top-16 right-1/3 w-28 h-14 bg-white rounded-full blur-sm animate-float-slow" />
        <div
          className="absolute top-40 left-1/4 w-20 h-10 bg-white rounded-full blur-sm animate-float"
          style={{ animationDelay: "-15s" }}
        />
        <div className="absolute top-24 left-2/3 w-36 h-18 bg-white rounded-full blur-sm animate-float-delayed" />
        <div className="absolute top-60 right-1/4 w-22 h-11 bg-white rounded-full blur-sm animate-float-slow" />
      </div>

      {/* Subtle sun rays */}
      <div className="absolute top-10 right-10 w-32 h-32 opacity-15">
        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl animate-pulse" />
        <div
          className="absolute inset-2 bg-yellow-200 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Additional atmospheric elements */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-1/3 left-1/5 w-40 h-20 bg-white rounded-full blur-md animate-float"
          style={{ animationDelay: "-8s" }}
        />
        <div className="absolute top-2/3 right-1/5 w-35 h-17 bg-white rounded-full blur-md animate-float-delayed" />
      </div>
    </div>
  )
}
