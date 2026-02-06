const Loading = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default Loading;
