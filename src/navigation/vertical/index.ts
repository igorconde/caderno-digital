// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import Alunos from 'mdi-material-ui/AccountSupervisorOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      sectionTitle: 'Administração'
    },
    {
      title: 'Alunos',
      icon: Alunos,
      path: '/alunos'
    },
    {
      title: 'Exercicios',
      path: '/exercicios',
      icon: GoogleCirclesExtended
    }
  ]
}

export default navigation
