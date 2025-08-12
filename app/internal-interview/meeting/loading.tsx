export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center">
      <div className="w-24 h-24 border-4 border-t-[#4F46E5] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <p className="text-[#EAEAEA] mt-4">Preparing your meeting...</p>
    </div>
  );
}
