import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Vote as VoteIcon, Check, Lock, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import departamentos from "@/data/Ubicacion/departamentos.json";
import provincias from "@/data/Ubicacion/provincias.json";
import distritos from "@/data/Ubicacion/distritos.json";
import { electoralApi } from '@/services/electoralApi';
import { ScrollArea } from "@/components/ui/scroll-area";

const departamentosArray = Object.values(departamentos).flat();
const provinciasArray = Object.values(provincias).flat();
const distritosArray = Object.values(distritos).flat();

const UBICACIONES_PERU = departamentosArray.reduce((acc: any, dept: any) => {
  const provinciasDept = provinciasArray.filter((p: any) => p.id_padre_ubigeo === dept.id_ubigeo);
  acc[dept.nombre_ubigeo] = provinciasDept.reduce((provAcc: any, prov: any) => {
    const distritosProv = distritosArray.filter((d: any) => d.id_padre_ubigeo === prov.id_ubigeo);
    provAcc[prov.nombre_ubigeo] = distritosProv.map((d: any) => d.nombre_ubigeo);
    return provAcc;
  }, {});
  return acc;
}, {});

interface Candidate {
  id: number;
  name: string;
  party: string;
  proposals?: string;
}

interface VoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VoteModal({ open, onOpenChange }: VoteModalProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [celular, setCelular] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [educacion, setEducacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      const loadCandidates = async () => {
        try {
          setLoadingCandidates(true);
          const data = await electoralApi.getCandidates();
          const realCandidates: Candidate[] = data.candidates.map((c: any) => ({
            id: Number(c.id),
            name: c.name,
            party: c.party,
            proposals: c.proposals || "Propuestas no disponibles"
          }));
          setCandidates(realCandidates);
        } catch (err) {
          toast.error("Error al cargar candidatos");
          console.error(err);
        } finally {
          setLoadingCandidates(false);
        }
      };
      loadCandidates();
    }
  }, [open]);

  const provinciasDisponibles = departamento ? Object.keys(UBICACIONES_PERU[departamento]) : [];
  const distritosDisponibles = departamento && provincia ? UBICACIONES_PERU[departamento][provincia] : [];

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCandidate || !nombre || !apellido || !dni || !celular || 
        !departamento || !provincia || !distrito || !email || 
        !edad || !genero || !educacion) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    if (!/^\d{8}$/.test(dni)) {
      toast.error("El DNI debe tener 8 dígitos");
      return;
    }

    if (!/^\d{9}$/.test(celular.replace(/\s/g, ''))) {
      toast.error("El número de celular debe tener 9 dígitos");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Ingrese un correo electrónico válido");
      return;
    }

    const edadNum = parseInt(edad);
    if (edadNum < 18 || edadNum > 99) {
      toast.error("La edad debe estar entre 18 y 99 años");
      return;
    }

    setLoading(true);

    try {
      const hasVoted = await electoralApi.checkIfVoted(dni, email);
      if (hasVoted) {
        toast.error('Ya has emitido tu voto anteriormente con este DNI o Email');
        setLoading(false);
        return;
      }

      await electoralApi.submitVote({
        nombre,
        apellido,
        dni,
        email,
        celular,
        departamento,
        provincia,
        distrito,
        edad: parseInt(edad),
        genero,
        educacion,
        candidate_id: parseInt(selectedCandidate)
      });

      setSubmitted(true);
      toast.success('¡Tu voto ha sido registrado exitosamente!');
    } catch (error: any) {
      console.error('Error al votar:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail || 'Ya has votado anteriormente');
      } else {
        toast.error('Error al registrar el voto. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSubmitted(false);
      setSelectedCandidate("");
      setNombre("");
      setApellido("");
      setDni("");
      setCelular("");
      setDepartamento("");
      setProvincia("");
      setDistrito("");
      setEmail("");
      setEdad("");
      setGenero("");
      setEducacion("");
      onOpenChange(false);
    }
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 gradient-hero rounded-full flex items-center justify-center animate-scale-in shadow-glow">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl">¡Voto Registrado!</DialogTitle>
              <DialogDescription className="text-base">
                Gracias {nombre} {apellido} por participar en el proceso electoral
              </DialogDescription>
            </DialogHeader>
            <p className="text-muted-foreground">
              Su voto ha sido registrado de forma segura y será contabilizado en los resultados finales.
            </p>
            <div className="p-4 bg-muted rounded-lg border border-border">
              <div className="flex items-center justify-center gap-2 text-foreground">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">Voto Encriptado y Seguro</span>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full gradient-hero shadow-elegant">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-hero rounded-lg flex items-center justify-center shadow-sm">
              <VoteIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Emitir Voto Electoral</DialogTitle>
              <DialogDescription>
                Complete el formulario para registrar su voto de forma segura
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleVote} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xs">
                  1
                </div>
                <h3 className="text-lg font-bold text-foreground">Información Personal</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej: Juan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required placeholder="Ej: Pérez" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI *</Label>
                  <Input id="dni" value={dni} onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))} required placeholder="12345678" maxLength={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Número de Celular *</Label>
                  <Input id="celular" value={celular} onChange={(e) => setCelular(e.target.value.replace(/\D/g, '').slice(0, 9))} required placeholder="987654321" maxLength={9} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="correo@ejemplo.com" />
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xs">
                  2
                </div>
                <h3 className="text-lg font-bold text-foreground">Ubicación</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento *</Label>
                  <Select value={departamento} onValueChange={(value) => { setDepartamento(value); setProvincia(""); setDistrito(""); }}>
                    <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                    <SelectContent>{Object.keys(UBICACIONES_PERU).map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Select value={provincia} onValueChange={(value) => { setProvincia(value); setDistrito(""); }} disabled={!departamento}>
                    <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                    <SelectContent>{provinciasDisponibles.map((prov) => (<SelectItem key={prov} value={prov}>{prov}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distrito">Distrito *</Label>
                  <Select value={distrito} onValueChange={setDistrito} disabled={!provincia}>
                    <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                    <SelectContent>{distritosDisponibles.map((dist) => (<SelectItem key={dist} value={dist}>{dist}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Información Demográfica */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xs">
                  3
                </div>
                <h3 className="text-lg font-bold text-foreground">Información Demográfica</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="edad">Edad *</Label>
                  <Input id="edad" type="number" value={edad} onChange={(e) => setEdad(e.target.value)} required min="18" max="99" placeholder="Ej: 25" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genero">Género *</Label>
                  <Select value={genero} onValueChange={setGenero}>
                    <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="educacion">Nivel Educativo *</Label>
                  <Select value={educacion} onValueChange={setEducacion}>
                    <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primaria">Primaria</SelectItem>
                      <SelectItem value="secundaria">Secundaria</SelectItem>
                      <SelectItem value="tecnica">Técnica</SelectItem>
                      <SelectItem value="universitaria">Universitaria</SelectItem>
                      <SelectItem value="posgrado">Posgrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Selección de Candidato */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xs">
                  4
                </div>
                <h3 className="text-lg font-bold text-foreground">Seleccione su Candidato</h3>
              </div>

              {loadingCandidates ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate} className="space-y-3">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-start space-x-3 border border-border rounded-lg p-3 hover:bg-muted/50 transition-smooth cursor-pointer">
                      <RadioGroupItem value={String(candidate.id)} id={`candidate-${candidate.id}`} />
                      <Label htmlFor={`candidate-${candidate.id}`} className="flex-1 cursor-pointer">
                        <div className="font-semibold text-foreground">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate.party}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>

            <Button type="submit" disabled={loading || loadingCandidates} className="w-full gradient-hero shadow-elegant hover:shadow-glow">
              {loading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Procesando...</>) : (<><VoteIcon className="mr-2 h-5 w-5" />Confirmar Voto</>)}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
