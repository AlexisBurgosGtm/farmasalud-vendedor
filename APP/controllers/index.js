let nav;
let user;
let cmbEmpnit;
let btnConfigTokenInicial;

try {
    let container_empresa;
    let container_btniniciar;    
} catch (error) {
    
}



async function getDataToken(){
    let tok = document.getElementById('txtUser').value;

    container_empresa.style = "visibility:visible";
    container_btniniciar.style = "visibility:visible";
     
    GlobalToken = tok;
    CargarComboEmpresas();  
}

async function fcnLogin(){
    GlobalTipoApp = document.getElementById('cmbAplicacion').value;
    cmbEmpnit = document.getElementById('cmbEmpresas');
    user = document.getElementById('txtUser');
    let pass = document.getElementById('txtPass');
    nav = document.getElementById('navbar-general');

    if(!user.value){
        funciones.AvisoError('Escriba el TOKEN de su Empresa');
    };

    if(!pass.value){
        funciones.AvisoError('Escriba su Contraseña');
    };
        
    if(GlobalTipoApp=='SALES'){
        try {
            const response = await fetch(`${GlobalServerUrl}/api/usuarios/login?token=${GlobalToken}`)
            const json = await response.json();
    
            json.recordset.map(ComprobarVendedor).join('\n');
       
        } catch (error) {
          console.log(error);
        }
    };

    if(GlobalTipoApp=='DELIVERY'){
        try {
            const response = await fetch(`${GlobalServerUrl}/api/reparto/usuarios/login?token=${GlobalToken}`)
            const json = await response.json();
    
            json.recordset.map(ComprobarRepartidor).join('\n');
       
        } catch (error) {
          console.log(error);
        }
    };
    
    if(GlobalTipoApp=='MANAGER'){
        
        funciones.Aviso('Bienvenido Administrador');

        funciones.loadView('./views/viewAdminInicio.html')
            .then(()=>{
                ControllerMenu('SALES');
                document.getElementById('cmbAnio').value = new Date().getFullYear();
                document.getElementById('cmbMes').value = new Date().getMonth();
                
                funciones.loadScript('../controllers/classAdmin.js','contenedor');
                
        });

    }


};

async function ComprobarVendedor(usuario) {
    if (usuario.EMPNIT==cmbEmpnit.value){
         if (usuario.CLAVE==txtPass.value){
                                           
            GlobalUser = user.value;
            //GlobalToken = user.value;
            GlobalCoddoc = usuario.CODDOC;
            GlobalCodven = usuario.CODVEN;
            GlobalEmpnit = usuario.EMPNIT;

            funciones.Aviso('Bienvenido ' + GlobalUser);

            funciones.loadView('./views/viewVentas.html')
                .then(()=>{
                    ControllerMenu('SALES');
                    dbSelectDocumentos(document.getElementById('tblDocumentos'),1);
                });
            
            };

    };     
};


async function ComprobarRepartidor(usuario) {
    if (usuario.DESREP==txtUser.value){
        if (usuario.CLAVE==txtPass.value){
            if (usuario.EMPNIT==cmbEmpnit.value){

                                  
            GlobalUser = user.value;
            //GlobalCoddoc = usuario.CODDOC;
            GlobalCodrep = usuario.CODREP;
            GlobalEmpnit = usuario.EMPNIT;

            funciones.Aviso('Bienvenido ' + GlobalUser);

            funciones.loadView('./views/viewEnvios.html')
                .then(()=>{
                    ControllerMenu('DELIVERY');
                    classEnvios.CargarDatosRepartidor();
                    classEnvios.CargarEnviosPendientes('tblEnviosPendientes');
               
                });
            
            };
        };
    };     
};


