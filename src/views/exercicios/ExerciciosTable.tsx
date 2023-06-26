// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Chip, TablePagination } from '@mui/material'

// ** Icons Imports
import firebaseApp from 'src/configs/firebaseConfig'

import { getDatabase, ref, onValue } from 'firebase/database'

const ExerciciosTable: React.FC = () => {
  // ** State
  const [firebaseData, setFirebaseData] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    const db = getDatabase(firebaseApp)
    const dbRef = ref(db, 'Students')
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val()

      const tableRowData: any[] = []
      for (const key in data.Users) {
        if (Object.hasOwnProperty.call(data.Users, key)) {
          const user = data.Users[key]
          const studentExercises = user.studentExercises
          const exerciseIds = Object.keys(studentExercises)

          exerciseIds.forEach(exerciseId => {
            const exercise = studentExercises[exerciseId]
            const tableRow = {
              studentName: user.studentName,
              subject: exercise.subject,
              answer: exercise.answer ? 'Acertou' : 'Errou'
            }
            tableRowData.push(tableRow)
          })
        }
      }

      setFirebaseData(tableRowData)
    })

    return () => unsubscribe()
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell>Nome do Aluno</TableCell>
            <TableCell align='center'>Matéria</TableCell>
            <TableCell align='center'>Resultado</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {firebaseData.map((row: any) => (
            <Row key={row.studentName} row={row} />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={10}
        rowsPerPage={30}
        page={1}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </TableContainer>
  )
}

type TableRowData = {
  studentName: string
  subject: string
  answer: 'Acertou' | 'Errou'
}

const Row: React.FC<{ row: TableRowData }> = ({ row }) => {
  const statusObj: Record<
    string,
    { color: 'default' | 'success' | 'error' | 'primary' | 'secondary' | 'info' | 'warning' | undefined }
  > = {
    Acertou: { color: 'success' },
    Errou: { color: 'error' }
  }

  return (
    <>
      <TableRow>
        <TableCell component='th' scope='row'>
          {row.studentName}
        </TableCell>
        <TableCell align='center'>
          <span style={{ fontSize: 'small', fontWeight: 'bold' }}>{row.subject.trim()}</span>
        </TableCell>
        <TableCell align='center'>
          <Chip
            label={row.answer}
            color={statusObj[row.answer]?.color || 'primary'}
            sx={{
              height: 24,
              fontSize: '0.75rem',
              textTransform: 'capitalize',
              '& .MuiChip-label': { fontWeight: 500 }
            }}
          />
        </TableCell>
      </TableRow>
    </>
  )
}

export default ExerciciosTable
