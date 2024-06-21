function RightSideAuth() {
  return (
      <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" className="text-purple-500 animate-bounce">
            <path fill="currentColor" d="M16.5 3A5.49 5.49 0 0 0 12 5.344A5.49 5.49 0 0 0 7.5 3A5.5 5.5 0 0 0 2 8.5c0 5.719 6.5 10.438 10 12.85c3.5-2.412 10-7.131 10-12.85A5.5 5.5 0 0 0 16.5 3"/>
          </svg>
        </div>
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg" />
      </div>
  );
}

export default RightSideAuth;