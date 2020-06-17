package main

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"

	socketio "github.com/googollee/go-socket.io"
)

func main() {
	server, err := socketio.NewServer(nil)

	if err != nil {
		log.Fatal(err)
	}

	//sockets
	server.OnConnect("/", func(so socketio.Conn) error {
		so.SetContext("")
		so.Join("chat_room")
		fmt.Println("nuevo usuario conectado")

		return nil
	})

	server.OnEvent("/", "chat message", func(so socketio.Conn, msg string) {

		server.BroadcastToRoom("", "chat_room", "chat message", msg)
		//	so.Emit("chat message", msg+":v")
	})

	go server.Serve()
	defer server.Close()

	go thread(server)

	//Modulo Http
	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./public")))
	http.HandleFunc("/killer", killer)
	log.Println("http://http:/localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func thread(server *socketio.Server) {

	for {

		// ************v RAM v************

		nombreArchivo := "/proc/meminfo"
		bytesLeidos, err := ioutil.ReadFile(nombreArchivo)
		if err != nil {
			fmt.Printf("Error leyendo archivo: %v", err)
		}

		contenido := string(bytesLeidos)
		vectord := strings.Split(contenido, "\n")

		ramTotal := strings.Replace((vectord[0])[10:len(vectord[0])-2], " ", "", -1)
		ramLibre := strings.Replace((vectord[1])[10:len(vectord[1])-2], " ", "", -1)
		ramDisponible := strings.Replace((vectord[2])[15:len(vectord[2])-2], " ", "", -1)

		total, err0 := strconv.Atoi(ramTotal)
		disponible, err1 := strconv.Atoi(ramDisponible)
		libre, err2 := strconv.Atoi(ramLibre)
		enUso := 0

		if err1 == nil && err2 == nil && err0 == nil {
			total = total / 1024
			disponible = disponible / 1024
			libre = libre / 1024
			enUso = disponible - libre
		}

		server.BroadcastToRoom("", "chat_room", "valores ram", total, libre, disponible, enUso)

		// ************v CPU v************

		out, err := exec.Command("mpstat").Output()
		if err != nil {
			log.Fatal(err)
		}
		salida := fmt.Sprintf("%s", out)
		vectorcpu := strings.Split(salida, "\n")
		cpuLibre := (vectorcpu[3])[len(vectorcpu[3])-6:]
		server.BroadcastToRoom("", "chat_room", "chat message", cpuLibre, cpuLibre, ramDisponible)

		time.Sleep(1250 * time.Millisecond)

		// ************v Procesos v************
		out, err = exec.Command("ls", "/proc").Output()
		salida = fmt.Sprintf("%s", out)
		vector := strings.Split(salida, "acpi")[0]
		vectord = strings.Split(vector, "\n")
		//re := regexp.MustCompile(`[\n]+`)
		//fmt.Println(re.ReplaceAllString(vector, ","))
		//fmt.Println(vectord)
		test := [][]string{}
		for i := 0; i < len(vectord)-1; i++ {

			// ************v Archivo status v************

			nombreArchivoStatus := "/proc/" + vectord[i] + "/status"
			nombreArchivoChildren := "/proc/" + vectord[i] + "/task/" + vectord[i] + "/children"
			bytesLeidos, err = ioutil.ReadFile(nombreArchivoStatus)
			if err != nil {
				fmt.Printf("Er archivo: %v\n", err)
				continue
			}

			bytesLeidosHijos, err := ioutil.ReadFile(nombreArchivoChildren)
			if err != nil {
				fmt.Printf("Er archivo h: %v\n", err)
				continue
			}
			contenidoHijos := string(bytesLeidosHijos)
			fmt.Println("hi_>", contenidoHijos)

			//contenido := string(bytesLeidos)
			//vectord = strings.Split(contenido, "\n")

			contenido := string(bytesLeidos)
			vectord := strings.Split(contenido, "\n")

			//re := regexp.MustCompile(`f[^\n]*`)
			proNombre := vectord[0]
			proEstado := vectord[2]
			proUsuario := vectord[8]
			proPid := vectord[5]
			proTam := vectord[17]

			// Extraer Pid
			re := regexp.MustCompile(`[0-9]+`)
			vPid := re.FindAll([]byte(proPid), -1)
			proPid = string(vPid[0])
			// Extraer state
			re2 := regexp.MustCompile(`\([^)]+\)`)
			vState := re2.FindAll([]byte(proEstado), -1)
			if len(vState) != 0 {
				proEstado = string(vState[0])
			}
			// Extraer tam
			re2 = regexp.MustCompile(`[0-9]+`)
			vState = re2.FindAll([]byte(proTam), -1)
			proTam = string(vState[0])

			test = append(test, []string{proPid, proNombre, proUsuario, proEstado, proTam, contenidoHijos})
			//test = append(test, []string{nombreArchivo, proNombre, proEstado})
			//fmt.Println(nombreArchivo)
		}
		server.BroadcastToRoom("", "chat_room", "pro tabla", test)
		server.BroadcastToRoom("", "chat_room", "pp", "ppppppp")
	}
	//Para simular una carga de trabajo
	//dormimos el programa x cantidad de segundo
	//donde x puede ir de x a 100

}

func killer(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Method)

	if r.Method == "GET" {

		if r.URL.Path != "/killer" {
			http.NotFound(w, r)
			return
		}
		for k, v := range r.URL.Query() {
			fmt.Println(k)
			fmt.Println("El proceso a eliminar por get es->", v)
			fmt.Println("\n**************************")
			err := exec.Command("kill", v[0]).Run()
			if err != nil {
				fmt.Println("erro eliminando proceso ->", v[0])
			}
			fmt.Println(v[0])
			fmt.Println("\n**************************")
		}

		t, _ := template.ParseFiles("public/index.html")
		t.Execute(w, nil)

	} else {
		fmt.Println(r.Method)
		r.ParseForm()
		fmt.Println("El proceso a eliminar es:", r.Form["idUs"])
	}

}

/*



package main

import (
	"fmt"
	"regexp"
)

func main() {
	re := regexp.MustCompile(`f[^\n]*`)
	fmt.Printf("%q\n", re.FindAll([]byte(`sea(food) fool`), -1))

}*/
