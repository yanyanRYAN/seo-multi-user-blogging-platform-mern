import GitHubIcon from '@mui/icons-material/GitHub'
const styles = {
    textAlign: "center",
    alignItems: "center",
}


const Footer = () => {

    return(
        <footer id="footer" style={styles}>
            <div >
                <p ><a href="https://github.com/yanyanRYAN"  className="text-muted"><GitHubIcon/>yanyanryan</a></p>
            </div>
            
        </footer>
    )
}

export default Footer;