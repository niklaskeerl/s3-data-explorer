'use client'
import DataLoader from '@/components/data-loader/DataLoader'
import ExolorerHeader from '@/components/explorer-header/ExplorerHeader'
import { Suspense } from 'react';

const Explorer = () => {
    return (
        <div>
            <ExolorerHeader />
            <Suspense fallback={<div>Loading</div>}>
                <DataLoader />
            </Suspense>
        </div>
    )
}

export default Explorer;