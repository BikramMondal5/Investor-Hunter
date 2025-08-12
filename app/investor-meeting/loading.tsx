export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0D0D0D]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 relative">
          <div className="absolute h-full w-full rounded-full border-4 border-t-[#4F46E5] border-r-[#6366F1] border-b-[#8B5CF6] border-l-[#9333EA] animate-spin"></div>
        </div>
        <p className="text-[#EAEAEA] font-medium">Loading meeting room...</p>
      </div>
    </div>
  );
}
