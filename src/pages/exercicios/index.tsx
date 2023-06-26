// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import ExerciciosTable from 'src/views/exercicios/ExerciciosTable'

const MUITable = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Exercícios Realizados' titleTypographyProps={{ variant: 'h6' }} />
          <Typography variant='subtitle1' component='div' sx={{ p: 4 }}>
            Aqui estão os últimos exercícios realizados pelos alunos:
          </Typography>
          <ExerciciosTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default MUITable
