'use client'
export default function ExplorerHeader(){
    return(
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-2xl font-bold mb-4 sm:mb-6">S3 Data Explorer</h1>
          <p className="text-lg sm:text-l text-gray-300 max-w-3xl mx-auto px-4">
            The following images are loaded from S3:
          </p>
        </div>
    )
}