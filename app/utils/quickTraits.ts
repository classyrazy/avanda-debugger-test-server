import { nanoid } from 'nanoid'

export const useQuickTraits = () => {
    function generateNanoId() {
      return nanoid(10)
    }

  return{
    generateNanoId
  }

}

