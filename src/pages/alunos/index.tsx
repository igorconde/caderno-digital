// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import AlunosTable from './AlunosTable'

const MUITable = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Alunos' titleTypographyProps={{ variant: 'h6' }} />
          <AlunosTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default MUITable
