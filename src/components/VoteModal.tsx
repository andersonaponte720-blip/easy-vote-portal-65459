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
  selectedCandidateId: number | null;
  voterData: {
    dni: string;
    nombre: string;
    apellidos: string;
    fechaNacimiento: string;
    region: string;
    distrito: string;
  };
}

export default function VoteModal({ open, onOpenChange, selectedCandidateId, voterData }: VoteModalProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loadingCandidate, setLoadingCandidate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open && selectedCandidateId) {
      const loadCandidate = async () => {
        try {
          setLoadingCandidate(true);
          const data = await electoralApi.getCandidates();
          const foundCandidate = data.candidates.find((c: any) => Number(c.id) === selectedCandidateId);
          if (foundCandidate) {
            setCandidate({
              id: Number(foundCandidate.id),
              name: foundCandidate.name,
              party: foundCandidate.party,
              proposals: foundCandidate.proposals || "Propuestas no disponibles"
            });
          }
        } catch (err) {
          toast.error("Error al cargar candidato");
          console.error(err);
        } finally {
          setLoadingCandidate(false);
        }
      };
      loadCandidate();
    }
  }, [open, selectedCandidateId]);

  const handleConfirmVote = async () => {
    if (!selectedCandidateId) return;

    setLoading(true);

    try {
      const birthDate = new Date(voterData.fechaNacimiento);
      const today = new Date();
      const edad = today.getFullYear() - birthDate.getFullYear();

      await electoralApi.submitVote({
        nombre: voterData.nombre,
        apellido: voterData.apellidos,
        dni: voterData.dni,
        email: `${voterData.dni}@electoral.pe`,
        celular: "000000000",
        departamento: voterData.region,
        provincia: voterData.region,
        distrito: voterData.distrito,
        edad: edad,
        genero: "no especificado",
        educacion: "no especificado",
        candidate_id: selectedCandidateId
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
      setCandidate(null);
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
                Gracias {voterData.nombre} {voterData.apellidos} por participar en el proceso electoral
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 gradient-hero rounded-lg flex items-center justify-center shadow-sm">
              <VoteIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Confirmar Voto</DialogTitle>
              <DialogDescription>
                Verifique su selección antes de confirmar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loadingCandidate ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : candidate ? (
          <div className="space-y-6">
            <div className="p-4 border border-border rounded-lg bg-muted/30 space-y-3">
              <div className="text-sm text-muted-foreground">Votante:</div>
              <div className="font-semibold text-foreground">
                {voterData.nombre} {voterData.apellidos}
              </div>
              <div className="text-sm text-muted-foreground">DNI: {voterData.dni}</div>
            </div>

            <div className="p-4 border-2 border-primary rounded-lg bg-primary/5 space-y-2">
              <div className="text-sm text-muted-foreground">Candidato seleccionado:</div>
              <div className="font-bold text-xl text-foreground">{candidate.name}</div>
              <div className="text-sm text-muted-foreground">{candidate.party}</div>
            </div>

            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-center text-sm font-medium text-foreground">
                ¿Está seguro de realizar este voto por este candidato?
              </p>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Esta acción no se puede deshacer
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmVote}
                disabled={loading}
                className="flex-1 gradient-hero shadow-elegant hover:shadow-glow"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Voto
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            No se pudo cargar la información del candidato
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
