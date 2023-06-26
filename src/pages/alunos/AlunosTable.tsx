// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import Drawer from '@mui/material/Drawer'

// ** Icons Imports
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Card, CardContent, CardHeader, Divider, List, ListItem, ListItemText, Tab, Tabs } from '@mui/material'
import { getDatabase, onValue, ref } from 'firebase/database'
import { ThemeColor } from 'src/@core/layouts/types'

interface ExerciseHistory {
  date: string
  customerId: string
  amount: number
}

interface TableRowData {
  name: string
  qtdExercicios: number
  matematica: number
  ciencias: number
  historia: number
  ingles: number
  historico: ExerciseHistory[]
}

const createData = (
  name: string,
  qtdExercicios: number,
  matematica: number,
  ciencias: number,
  historia: number,
  ingles: number
): TableRowData => {
  return {
    name,
    qtdExercicios,
    matematica,
    ciencias,
    historia,
    ingles,
    historico: [
      {
        date: '01/06/2023',
        customerId: 'Matemática',
        amount: 10
      },
      {
        date: '01/06/2023',
        customerId: 'Português',
        amount: 10
      }
    ]
  }
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
  qtdTotalExercicio: number
  qtdTotalExercicioMatematica: number
  qtdTotalExercicioCiencia: number
  qtdTotalExercicioHistoria: number
  qtdTotalExercicioIngles: number
}

const Row: React.FC<{ row: ConsolidatedData; setSelectedAluno: (studentName: string | null) => void }> = ({
  row,
  setSelectedAluno
}) => {
  // ** State

  return (
    <Fragment>
      <TableRow>
        <TableCell>{row.studentName}</TableCell>
        <TableCell align='center'>{row.qtdTotalExercicio}</TableCell>
        <TableCell align='center'>{row.qtdTotalExercicioMatematica}</TableCell>
        <TableCell align='center'>{row.qtdTotalExercicioCiencia}</TableCell>
        <TableCell align='center'>{row.qtdTotalExercicioHistoria}</TableCell>
        <TableCell align='center'>{row.qtdTotalExercicioIngles}</TableCell>
        {/* <TableCell align='center'>
          <IconButton aria-label='ver detalhes' size='small' onClick={() => setSelectedAluno(row.studentName)}>
            <VisibilityIcon />
          </IconButton>
        </TableCell> */}
      </TableRow>
    </Fragment>
  )
}

const AlunosTable: React.FC = () => {
  const [selectedAluno, setSelectedAluno] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue)
  }

  const [firebaseData, setFirebaseData] = useState<ConsolidatedData[]>([])

  useEffect(() => {
    const db = getDatabase()
    const dbRef = ref(db, 'Students')
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val()
      const consolidatedData: Record<string, ConsolidatedData> = {}

      for (const userId in data.Users) {
        if (Object.hasOwnProperty.call(data.Users, userId)) {
          const user = data.Users[userId]
          const studentExercises = user.studentExercises

          for (const exerciseId in studentExercises) {
            const exercise = studentExercises[exerciseId]
            const { subject } = exercise
            const key = user.studentName

            if (!consolidatedData[key]) {
              consolidatedData[key] = {
                studentName: user.studentName,
                qtdTotalExercicio: 0,
                qtdTotalExercicioMatematica: 0,
                qtdTotalExercicioCiencia: 0,
                qtdTotalExercicioHistoria: 0,
                qtdTotalExercicioIngles: 0
              }
            }

            consolidatedData[key].qtdTotalExercicio++
            switch (subject) {
              case 'MATEMÁTICA':
                consolidatedData[key].qtdTotalExercicioMatematica++
                break
              case 'CIÊNCIA':
                consolidatedData[key].qtdTotalExercicioCiencia++
                break
              case 'HISTÓRIA':
                consolidatedData[key].qtdTotalExercicioHistoria++
                break
              case 'INGLÊS':
                consolidatedData[key].qtdTotalExercicioIngles++
                break
              default:
                break
            }
          }
        }
      }

      const transformedData = Object.values(consolidatedData)
      setFirebaseData(transformedData)
    })

    return () => unsubscribe()
  }, [])

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Aluno</TableCell>
              <TableCell align='center'>Quantidade de Exercícios</TableCell>
              <TableCell align='center'>Matemática</TableCell>
              <TableCell align='center'>Ciências</TableCell>
              <TableCell align='center'>História</TableCell>
              <TableCell align='center'>Inglês</TableCell>
              {/* <TableCell align='center'>Detalhes</TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {firebaseData.map((row: any) => (
              <Row key={row.studentName} row={row} setSelectedAluno={setSelectedAluno} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer
        anchor='right'
        open={selectedAluno !== null}
        onClose={() => setSelectedAluno(null)}
        PaperProps={{
          sx: { width: '40%' }
        }}
      >
        {selectedAluno && (
          <Box sx={{ p: 8 }}>
            <Typography variant='h6'>{selectedAluno}</Typography>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor='primary'
              textColor='primary'
              variant='fullWidth'
            >
              <Tab label='Notas' />
              <Tab label='Questões' />
            </Tabs>

            <Divider />

            {tabValue === 0 && (
              <Card sx={{ mt: 4 }}>
                <CardHeader title='Notas do Aluno' />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemText primary='Matemática' secondary={10} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary='Ciências' secondary={20} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary='História' secondary={30} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary='Inglês' secondary={40} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            )}

            {tabValue === 1 && (
              <Card sx={{ mt: 4 }}>
                <CardHeader title='Histórico de Questões' />
                <CardContent>
                  <Table size='small' aria-label='histórico de questões'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Data</TableCell>
                        <TableCell>Matéria</TableCell>
                        <TableCell align='right'>Quantidade de Questões</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {alunoSelecionado?.historico.map((historyRow: ExerciseHistory) => (
                        <TableRow key={historyRow.date}>
                          <TableCell component='th' scope='row'>
                            {historyRow.date}
                          </TableCell>
                          <TableCell>{historyRow.customerId}</TableCell>
                          <TableCell align='right'>{historyRow.amount}</TableCell>
                        </TableRow>
                      ))} */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Drawer>
    </>
  )
}

const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)

export default AlunosTable
