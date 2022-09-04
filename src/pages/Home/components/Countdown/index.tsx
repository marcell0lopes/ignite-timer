import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'

import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmountDisplay = Math.floor(currentSeconds / 60)
  const secondsAmountDisplay = currentSeconds % 60

  const minutesDisplay = String(minutesAmountDisplay).padStart(2, '0')
  const secondsDisplay = String(secondsAmountDisplay).padStart(2, '0')

  // Page Title useEffect
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutesDisplay}:${secondsDisplay}`
    }
  }, [activeCycle, minutesDisplay, secondsDisplay])

  // Timer Countdown useEffect
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

  return (
    <CountdownContainer>
      <span>{minutesDisplay[0]}</span>
      <span>{minutesDisplay[1]}</span>
      <Separator>:</Separator>
      <span>{secondsDisplay[0]}</span>
      <span>{secondsDisplay[1]}</span>
    </CountdownContainer>
  )
}
