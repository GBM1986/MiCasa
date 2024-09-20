import React from 'react'
import { BoligerList } from '../components/BoligerList'

export const Boliger = () => {
  return (
    <div>
      <h1 className='text-heading-1 pl-9 mb-2'>Boliger til salg</h1>
      <BoligerList />
    </div>
  )
}
