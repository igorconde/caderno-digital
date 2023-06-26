// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { useEffect, useState } from 'react'
import { getDatabase, onValue, ref } from 'firebase/database'
import firebaseApp from 'src/configs/firebaseConfig'

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  pendente: { color: 'warning' },
  concluído: { color: 'success' },
  aprovado: { color: 'success' },
  refazer: { color: 'error' }
}

interface Exercise {
  answer: boolean
  questionName: string
  subject: string
}

interface Student {
  studentExercises: Record<string, Exercise>
  studentName: string
}

interface UserData {
  [userId: string]: Student
}

interface ConsolidatedData {
  studentName: string
  subject: string
  nomeMateria: string
  nomeExercicio: string
  quantidadeExercicios: number
  quantidadeAcertos: number
  quantidadeErros: number
  notaFinal: number
}

const DashboardTable = () => {
  const [firebaseData, setFirebaseData] = useState<ConsolidatedData[]>([])

  useEffect(() => {
    const db = getDatabase()
    const dbRef = ref(db, 'Students')
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val()

      const consolidatedData: ConsolidatedData[] = []

      for (const userId in data.Users) {
        if (Object.hasOwnProperty.call(data.Users, userId)) {
          const user = data.Users[userId]
          const studentExercises = user.studentExercises

          const subjectsMap: Record<string, ConsolidatedData> = {}

          for (const exerciseId in studentExercises) {
            const exercise = studentExercises[exerciseId]
            const { subject } = exercise

            if (!subjectsMap[subject]) {
              subjectsMap[subject] = {
                studentName: user.studentName,
                nomeMateria: capitalize(subject.toLowerCase()),
                nomeExercicio: `Exercicio de ${capitalize(subject.toLowerCase())}`,
                subject,
                quantidadeExercicios: 0,
                quantidadeAcertos: 0,
                quantidadeErros: 0,
                notaFinal: 0
              }
            }

            subjectsMap[subject].quantidadeExercicios++
            subjectsMap[subject].quantidadeAcertos += exercise.answer ? 1 : 0
            subjectsMap[subject].quantidadeErros += exercise.answer ? 0 : 1
            subjectsMap[subject].notaFinal =
              subjectsMap[subject].quantidadeExercicios / subjectsMap[subject].quantidadeErros
          }

          const subjectsData = Object.values(subjectsMap)
          consolidatedData.push(...subjectsData)
        }
      }

      setFirebaseData(consolidatedData)
    })

    return () => unsubscribe()
  }, [])

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Estudante</TableCell>
              <TableCell>Exercício</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Assunto</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {firebaseData.map((data: ConsolidatedData) => (
              <TableRow hover key={data.studentName} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                      {data.studentName}
                    </Typography>
                    <Typography variant='caption'>{data.nomeMateria}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{data.nomeExercicio}</TableCell>
                <TableCell> {new Date().toLocaleDateString('pt-BR')} </TableCell>
                <TableCell> {data.notaFinal === Infinity ? '10.0' : data.notaFinal.toFixed(1)}</TableCell>
                <TableCell>{data.nomeMateria}</TableCell>
                <TableCell>
                  <Chip
                    label={data.notaFinal > 7 ? 'aprovado' : 'refazer'} // Considerando o status com base na nota final.
                    color={statusObj[data.notaFinal > 7 ? 'aprovado' : 'refazer'].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)

export default DashboardTable
