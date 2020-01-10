let btnNuevoCenso;
let btnGuardarCenso;
let btnCancelarCenso;
let btnObtenerUbicacion;

//formulario censo nuevo

classCenso={
    CargarFuncionesCenso: async ()=>{
        btnNuevoCenso = document.getElementById('btnNuevoCenso');
        btnGuardarCenso = document.getElementById('btnGuardarCenso');
        btnCancelarCenso= document.getElementById('btnCancelarCenso');
        btnObtenerUbicacion = document.getElementById('btnObtenerUbicacion');
                
        btnObtenerUbicacion.addEventListener('click',()=>{
            let lat,long;
            lat = document.getElementById('txtLatitud');
            long = document.getElementById('txtLongitud');

            classCenso.ObtenerUbicacion(lat,long);
        });

        btnNuevoCenso.addEventListener('click', ()=>{
            btnNuevoCenso.style = "visibility:hidden";
        });

        btnCancelarCenso.addEventListener('click', ()=>{
            btnNuevoCenso.style = "visibility:visible";
        });
        
        btnGuardarCenso.addEventListener('click',()=>{
            funciones.Confirmacion('¿Está seguro que desea registrar este cliente?')
            .then((value) => {
       
                if (value==true){
                    let nit, nombre, direccion, codmuni, telefono, lat, long, obs;

                    nit = document.getElementById('txtNit').value;
                    nombre = document.getElementById('txtNomcliente').value;
                    direccion = document.getElementById('txtDircliente').value;
                    codmuni = document.getElementById('cmbMunicipio').value;
                    telefono = document.getElementById('txtTelefono').value;
                    lat = document.getElementById('txtLatitud').innerText;
                    long = document.getElementById('txtLongitud').innerText;
                    obs = document.getElementById('txtObs').value;
        
                    classCenso.InsertCliente(GlobalEmpnit,GlobalCodven,nit,nombre,direccion,codmuni,1,telefono,lat,long,obs);
                    classCenso.SelectCensoAll(GlobalEmpnit,GlobalCodven,document.getElementById('tblCenso'));
                    btnCancelarCenso.click();
                }
            })

        })

        classCenso.GetListaMunicipios(document.getElementById('cmbMunicipio'));

    },
    
    SelectCensoAll: (empnit,codven,contenedor)=>{
        DbConnection.select({
            From: "censo"
        }, function (censo) {
    
            var HtmlString = "";
            censo.forEach(function (cliente) {
                if (cliente.empnit==empnit){
                    if (cliente.codven==codven){
                        HtmlString += "<tr Id=" + cliente.Id + ">" + 
                        "<td class='col-5'>" + cliente.nomcliente + "</td>" + 
                        "<td class='col-5'>" + cliente.dircliente + "</td>" + 
                        "<td class='col-1'>" + cliente.telefono + "</td>" + 
                        "<td class='col-1'><button class='btn btn-round btn-icon btn-danger btn-sm' onclick='classCenso.DeleteCliente(" + cliente.Id +");'>x</button></td></tr>";                        
                    }
                }

            }, function (error) {
                console.log(error);
            })
            contenedor.innerHTML = HtmlString;
        });
    },

    ObtenerUbicacion: async(lat,long)=>{
        try {
            navigator.geolocation.getCurrentPosition(function (location) {
                lat.innerText = location.coords.latitude.toString();
                long.innerText = location.coords.longitude.toString();
            })
        } catch (error) {
            funciones.AvisoError(error.toString());
        }
    },

    InsertCliente: async (empnit,codven,nit,nombre,direccion,codmunicipio,coddepartamento,telefono,latitud,longitud,obs)=>{
        var data = {
            empnit:empnit,
            codven:codven,
            nit:nit,
            nomcliente:nombre,
            dircliente:direccion,
            codmun:codmunicipio,
            coddep:coddepartamento,
            telefono:telefono,
            latitud:latitud,
            longitud:longitud,
            obs:obs
        };
        DbConnection = new JsStore.Instance(DbName);
        await DbConnection.insert({Into: "censo",Values: [data]},
                function (rowsAdded) {
                    funciones.Aviso('Cliente registrado exitosamente');
                    classCenso.LimpiarCampos();
                }, 
                function (err) {
                    console.log(err);
                    funciones.AvisoError('No se puedo Guardar este Cliente, error de base de datos');
                })
    },

    DeleteCliente: (id)=>{
        funciones.Confirmacion('¿Está seguro que desea ELIMINAR este cliente?')
            .then((value)=>{
                if(value==true){
                    DbConnection.delete({
                        From: 'censo',
                        Where: {
                            Id: Number(id)
                        }
                    }, function (rowsDeleted) {
                        console.log(rowsDeleted + ' rows deleted');
                        if (rowsDeleted > 0) {
                            document.getElementById(id).remove();
                            classCenso.SelectCensoAll(GlobalEmpnit,GlobalCodven,document.getElementById('tblCenso'));
                            funciones.Aviso("Cliente eliminado con éxito");
                        }
                    }, function (error) {
                        alert(error.Message);
                    })
                }
            })
    },
    GetLatLong: ()=>{

    },
    GetListaMunicipios: (ComboboxContainer)=>{
        let lista = `<option value="1">GUATEMALA</option>
                     ` 

        ComboboxContainer.innerHTML = lista;
    },
    LimpiarCampos: ()=>{
        document.getElementById('txtNit').value = '';
        document.getElementById('txtNomcliente').value= '';
        document.getElementById('txtDircliente').value= '';
        document.getElementById('txtTelefono').value= '';
        document.getElementById('txtObs').value= '';
        document.getElementById('txtLatitud').innerText = '0';
        document.getElementById('txtLongitud').innerText= '0';
    }
}