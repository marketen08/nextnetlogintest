import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, PenToolIcon as Tool, Warehouse, MenuIcon, Target, Users } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

// ** Redux imports
import { useAppDispatch } from "../store/hooks"

export default function Menu() {
    // ** State **
    const [activeButton, setActiveButton] = useState<string | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // ** Redux **
    const dispatch = useAppDispatch();


    // ** Functions **
    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName)
        setMobileMenuOpen(false)
        // Here you would add navigation or other functionality
        console.log(`Clicked on ${buttonName}`)
    }

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logging out...")
        setMobileMenuOpen(false)
        dispatch({ type: 'user/logout' });
        // Example: router.push('/login')
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Desktop Menu */}
            <div className="hidden sm:flex justify-between items-center gap-4 bg-card rounded-lg shadow-sm p-4 border">
                <div className="flex gap-3">
                    <Link href="/pañol">
                        <Button variant={activeButton === "pañol" ? "default" : "outline"} onClick={() => handleButtonClick("pañol")}>
                            <Warehouse className="mr-2 h-4 w-4" />
                            Pañol
                        </Button>
                    </Link>

                    <Link href="/taller">
                        <Button
                            variant={activeButton === "taller" ? "default" : "outline"}
                            onClick={() => handleButtonClick("taller")}
                        >
                            <Tool className="mr-2 h-4 w-4" />
                            Taller
                        </Button>
                    </Link>

                    <Link href="/tareas">
                        <Button
                            variant={activeButton === "tareas" ? "default" : "outline"}
                            onClick={() => handleButtonClick("tareas")}
                        >
                            <Target className="mr-2 h-4 w-4" />
                            Tareas
                        </Button>
                    </Link>

                    <Link href="/colaboradores">
                        <Button
                            variant={activeButton === "colaboradores" ? "default" : "outline"}
                            onClick={() => handleButtonClick("colaboradores")}
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Colaboradores
                        </Button>
                    </Link>
                </div>

                <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex sm:hidden justify-between items-center bg-card rounded-lg shadow-sm p-4 border">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MenuIcon className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                        <div className="flex flex-col gap-4 mt-8">
                            <Link href="/pañol">
                                <Button
                                    variant={activeButton === "pañol" ? "default" : "outline"}
                                    className="justify-start w-full"
                                    onClick={() => handleButtonClick("pañol")}
                                >
                                    <Warehouse className="mr-2 h-4 w-4" />
                                    Pañol
                                </Button>
                            </Link>

                            <Link href="/taller">
                                <Button
                                    variant={activeButton === "taller" ? "default" : "outline"}
                                    className="justify-start w-full"
                                    onClick={() => handleButtonClick("taller")}
                                >
                                    <Tool className="mr-2 h-4 w-4" />
                                    Taller
                                </Button>
                            </Link>

                            <Link href="/tareas">
                                <Button
                                    variant={activeButton === "tareas" ? "default" : "outline"}
                                    className="justify-start w-full"
                                    onClick={() => handleButtonClick("tareas")}
                                >
                                    <Target className="mr-2 h-4 w-4" />
                                    Tareas
                                </Button>
                            </Link>

                            <Link href="/colaboradores">
                                <Button
                                    variant={activeButton === "colaboradores" ? "default" : "outline"}
                                    className="justify-start w-full"
                                    onClick={() => handleButtonClick("colaboradores")}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Colaboradores
                                </Button>
                            </Link>

                            <Button variant="destructive" className="justify-start mt-4" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Cerrar sesión
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="text-lg font-medium">
                    {activeButton === "pañol" ? "Pañol" : 
                     activeButton === "taller" ? "Taller" : 
                     activeButton === "tareas" ? "Tareas" :
                     activeButton === "colaboradores" ? "Colaboradores" : "Menu"}
                </div>

                <Button variant="destructive" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Cerrar sesión</span>
                </Button>
            </div>
        </div>
    )
}

