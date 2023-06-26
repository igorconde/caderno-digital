// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icons Imports
import MenuUp from 'mdi-material-ui/MenuUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { useEffect, useState } from 'react'
import { getDatabase, onValue, ref } from 'firebase/database'

interface StudentDataType {
  name: string
  avatarSrc: string
  grade: string
  subject: string
  completionRate: number
  color: ThemeColor
  avatarHeight: number
}

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

const StudentPerformance = () => {
  const [firebaseData, setFirebaseData] = useState<ConsolidatedData[]>([])

  useEffect(() => {
    const db = getDatabase()
    const dbRef = ref(db, 'Students')
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val()

      const consolidatedData: Record<string, any> = {}

      for (const userId in data.Users) {
        if (Object.hasOwnProperty.call(data.Users, userId)) {
          const user = data.Users[userId]
          const studentExercises = user.studentExercises

          if (!consolidatedData[user.studentName]) {
            consolidatedData[user.studentName] = {
              studentName: user.studentName,
              materias: [],
              quantidadeExercicios: 0,
              quantidadeAcertos: 0,
              quantidadeErros: 0,
              notaFinal: 0
            }
          }

          for (const exerciseId in studentExercises) {
            const exercise = studentExercises[exerciseId]
            const { subject } = exercise

            if (!consolidatedData[user.studentName].materias.includes(capitalize(subject.toLowerCase()))) {
              consolidatedData[user.studentName].materias.push(capitalize(subject.toLowerCase()))
            }

            consolidatedData[user.studentName].quantidadeExercicios++
            consolidatedData[user.studentName].quantidadeAcertos += exercise.answer ? 1 : 0
            consolidatedData[user.studentName].quantidadeErros += exercise.answer ? 0 : 1
            consolidatedData[user.studentName].notaFinal = (
              (consolidatedData[user.studentName].quantidadeAcertos /
                consolidatedData[user.studentName].quantidadeExercicios) *
              10
            ).toFixed(2) as unknown as number
          }
        }
      }

      setFirebaseData(Object.values(consolidatedData))
    })

    return () => unsubscribe()
  }, [])

  return (
    <Card>
      <CardHeader
        title='Desempenho do Estudante'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
        <Typography component='p' variant='caption' sx={{ mb: 10 }}>
          Comparação de todos os exericicos realizados pelos alunos.
        </Typography>

        {firebaseData.map((data: ConsolidatedData) => {
          return (
            <Box
              key={data.studentName}
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  mt: 1,
                  width: 36,
                  height: 37,
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.04)`
                }}
              ></Avatar>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                    {data.studentName}
                  </Typography>
                  <Typography variant='caption'>{data.subject}</Typography>
                </Box>

                <Box sx={{ minWidth: 85, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                    Nota: {data.notaFinal}
                  </Typography>
                  {/* <LinearProgress color={data.color} value={student.completionRate} variant='determinate' /> */}
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)

export default StudentPerformance
