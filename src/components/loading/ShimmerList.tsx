interface ShimmerProps {
    count?: number;
}

export const ShimmerList = ({ count = 4 }:ShimmerProps) => {
    return (<>{

        Array.from({length: count}).map((_, index) => (
            <div key={`shimmer-${index}`} className="px-5 py-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded-md w-1/3 mb-2.5"></div>
                <div className="flex gap-4">
                    <div className="h-3 bg-slate-100 rounded-md w-20"></div>
                    <div className="h-3 bg-slate-100 rounded-md w-24"></div>
                </div>
            </div>
        ))
    } </>)
}