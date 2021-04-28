import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import login from './pages/login';
import signup from './pages/signup';
import home from './pages/home';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#63ccff',
			main: '#039be5',
			dark: '#006db3',
			contrastText: '#fff'
		},
    secondary: {
			light: '#ff844c',
			main: '#f4511e',
			dark: '#b91400',
			contrastText: '#fff'
		}
	}
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
  <Router>
<Switch>
  <Route exact path="/login" component={login}/>
  <Route exact path="/signup" component={signup}/>
  <Route exact path="/" component={home}/>
</Switch>
</Router>
</MuiThemeProvider>
  );
}

export default App;
