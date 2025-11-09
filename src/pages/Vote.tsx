import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, User, MapPin, FileText, Globe, Mail, Vote, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VoteModal from "@/components/VoteModal";
import distritos from "@/data/Ubicacion/distritos.json";
import departamentos from "@/data/Ubicacion/departamentos.json";
import provincias from "@/data/Ubicacion/provincias.json";
import { toast } from "sonner";

const distritosArray = Object.values(distritos).flat();
const departamentosArray = Object.values(departamentos).flat();
const provinciasArray = Object.values(provincias).flat();

interface Candidate {
  id: number;
  name: string;
  party: string;
  photo: string;
  bio: string;
  education: string;
  experience: string;
  proposals: string[];
  social: {
    website?: string;
    email?: string;
  };
  color: string;
}

export default function VotePage() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedCandidateForVote, setSelectedCandidateForVote] = useState<number | null>(null);
  
  // Estados para el formulario de acceso
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [voterDni, setVoterDni] = useState("");
  const [voterName, setVoterName] = useState("");
  const [voterApellidos, setVoterApellidos] = useState("");
  const [voterFechaNacimiento, setVoterFechaNacimiento] = useState("");
  const [voterRegion, setVoterRegion] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [voterDistrito, setVoterDistrito] = useState("");

  // Filtrar distritos según la región seleccionada
  // Primero obtenemos las provincias del departamento, luego los distritos de esas provincias
  const filteredDistritos = useMemo(() => {
    if (!selectedRegionId) return [];
    
    // Obtener todas las provincias del departamento seleccionado
    const provinciasDelDepartamento = provinciasArray.filter(
      (prov: any) => prov.id_padre_ubigeo === selectedRegionId
    );
    
    // Obtener los IDs de esas provincias
    const provinciaIds = provinciasDelDepartamento.map((prov: any) => prov.id_ubigeo);
    
    // Filtrar distritos que pertenezcan a esas provincias
    return distritosArray.filter((dist: any) => 
      provinciaIds.includes(dist.id_padre_ubigeo)
    );
  }, [selectedRegionId]);

  const presidentialCandidates: Candidate[] = [
    {
      id: 1,
      name: "Ana García López",
      party: "Partido Alpha",
      photo: "/placeholder.svg",
      bio: "Economista con 20 años de experiencia en el sector público.",
      education: "PhD en Economía - Universidad Nacional",
      experience: "Ex Ministra de Economía (2018-2022), Senadora (2014-2018)",
      proposals: [
        "Reducción del 50% en impuestos a pequeñas empresas",
        "Inversión de $5B en infraestructura educativa",
        "Plan de salud universal para todos los ciudadanos",
      ],
      social: {
        website: "https://anagarcia.com",
        email: "contacto@anagarcia.com",
      },
      color: "hsl(220 85% 45%)",
    },
    {
      id: 2,
      name: "Carlos Mendoza Ruiz",
      party: "Partido Beta",
      photo: "/placeholder.svg",
      bio: "Abogado y defensor de derechos humanos.",
      education: "Maestría en Derecho Internacional - Harvard",
      experience: "Alcalde de Lima (2016-2020), Congresista (2011-2016)",
      proposals: [
        "Reforma judicial integral",
        "Lucha contra la corrupción con nuevas leyes",
        "Modernización del sistema de justicia",
      ],
      social: {
        website: "https://carlosmendoza.com",
        email: "info@carlosmendoza.com",
      },
      color: "hsl(200 95% 45%)",
    },
  ];

  const regionalCandidates: Candidate[] = [
    {
      id: 3,
      name: "María Fernández",
      party: "Partido Alpha",
      photo: "/placeholder.svg",
      bio: "Ingeniera ambiental comprometida con el desarrollo sostenible.",
      education: "Maestría en Gestión Ambiental",
      experience: "Directora Regional de Medio Ambiente (2019-2023)",
      proposals: [
        "Programa de reforestación de 1M de árboles",
        "Energías renovables en todas las escuelas",
        "Gestión de residuos con tecnología de punta",
      ],
      social: {
        email: "maria.fernandez@region.gob",
      },
      color: "hsl(220 85% 45%)",
    },
    {
      id: 4,
      name: "Roberto Silva",
      party: "Partido Beta",
      photo: "/placeholder.svg",
      bio: "Economista enfocado en desarrollo regional.",
      education: "PhD en Economía Regional",
      experience: "Asesor Económico Regional (2017-2023)",
      proposals: [
        "Creación de 50,000 empleos en 4 años",
        "Incentivos fiscales para empresas regionales",
        "Modernización de mercados locales",
      ],
      social: {
        email: "roberto.silva@region.gob",
      },
      color: "hsl(200 95% 45%)",
    },
  ];

  const distritalCandidates: Candidate[] = [
    {
      id: 5,
      name: "Laura Pérez",
      party: "Partido Gamma",
      photo: "/placeholder.svg",
      bio: "Educadora con experiencia en gestión municipal.",
      education: "Licenciatura en Educación",
      experience: "Regidora Municipal (2018-2022)",
      proposals: [
        "Construcción de 10 nuevas escuelas",
        "Programa de becas para estudiantes",
        "Centros deportivos en cada barrio",
      ],
      social: {
        email: "laura.perez@distrito.gob",
      },
      color: "hsl(0 75% 55%)",
    },
  ];

  const handleViewMore = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setModalOpen(true);
  };

  const handleVoteClick = (candidateId: number) => {
    setSelectedCandidateForVote(candidateId);
    setVoteModalOpen(true);
  };

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!voterDni || !voterName || !voterApellidos || !voterFechaNacimiento || !voterRegion || !voterDistrito) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    if (!/^\d{8}$/.test(voterDni)) {
      toast.error("El DNI debe tener 8 dígitos");
      return;
    }

    setIsAuthenticated(true);
    toast.success("Acceso verificado. Ahora puede votar.");
  };

  // Si no está autenticado, mostrar formulario de acceso
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-elegant">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 gradient-hero rounded-full flex items-center justify-center shadow-glow">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Verificación de Votante</CardTitle>
            <CardDescription>
              Por favor ingrese sus datos para acceder al sistema de votación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccessSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dni">Número de DNI *</Label>
                  <Input
                    id="dni"
                    value={voterDni}
                    onChange={(e) => setVoterDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="12345678"
                    maxLength={8}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombres *</Label>
                  <Input
                    id="nombre"
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                    placeholder="Ej: Juan Carlos"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos Completos *</Label>
                  <Input
                    id="apellidos"
                    value={voterApellidos}
                    onChange={(e) => setVoterApellidos(e.target.value)}
                    placeholder="Ej: Pérez García"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={voterFechaNacimiento}
                    onChange={(e) => setVoterFechaNacimiento(e.target.value)}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Región *</Label>
                  <Select 
                    value={voterRegion} 
                    onValueChange={(value) => {
                      const selectedDep = departamentosArray.find((dep: any) => dep.nombre_ubigeo === value);
                      setVoterRegion(value);
                      setSelectedRegionId(selectedDep?.id_ubigeo || "");
                      setVoterDistrito(""); // Resetear distrito cuando cambia la región
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione su región" />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentosArray.map((dep: any) => (
                        <SelectItem key={dep.id_ubigeo} value={dep.nombre_ubigeo}>
                          {dep.nombre_ubigeo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distrito">Distrito de Residencia *</Label>
                  <Select 
                    value={voterDistrito} 
                    onValueChange={setVoterDistrito}
                    disabled={!voterRegion}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={voterRegion ? "Seleccione su distrito" : "Primero seleccione una región"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDistritos.map((dist: any) => (
                        <SelectItem key={dist.id_ubigeo} value={dist.nombre_ubigeo}>
                          {dist.nombre_ubigeo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full gradient-hero shadow-elegant hover:shadow-glow">
                Acceder al Sistema de Votación
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderCandidates = (candidates: Candidate[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {candidates.map((candidate) => (
        <Card 
          key={candidate.id} 
          className="border-border shadow-sm hover:shadow-elegant transition-smooth"
          style={{ borderLeftWidth: '4px', borderLeftColor: candidate.color }}
        >
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={candidate.photo} alt={candidate.name} />
                <AvatarFallback className="text-xl">{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">{candidate.name}</CardTitle>
                <Badge style={{ backgroundColor: candidate.color }} className="text-white">
                  {candidate.party}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-sm">{candidate.bio}</CardDescription>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">Propuestas principales:</div>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                    {candidate.proposals.slice(0, 2).map((proposal, idx) => (
                      <li key={idx} className="text-xs">{proposal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => handleViewMore(candidate)}
                className="flex-1"
                variant="outline"
              >
                Ver más
              </Button>
              <Button 
                onClick={() => handleVoteClick(candidate.id)} 
                className="flex-1 gradient-hero shadow-elegant hover:shadow-glow"
              >
                <Vote className="h-4 w-4 mr-2" />
                Votar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground flex items-center justify-center gap-3">
            <Users className="h-10 w-10 text-primary" />
            Candidatos
          </h1>
          <p className="text-lg text-muted-foreground">Conozca las propuestas y trayectoria de cada candidato</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="presidential" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="presidential">Presidencial</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
            <TabsTrigger value="distrital">Distrital</TabsTrigger>
          </TabsList>

          <TabsContent value="presidential" className="mt-8">
            {renderCandidates(presidentialCandidates)}
          </TabsContent>

          <TabsContent value="regional" className="mt-8">
            {renderCandidates(regionalCandidates)}
          </TabsContent>

          <TabsContent value="distrital" className="mt-8">
            {renderCandidates(distritalCandidates)}
          </TabsContent>
        </Tabs>
      </div>

      {/* Detailed Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedCandidate.photo} alt={selectedCandidate.name} />
                    <AvatarFallback className="text-2xl">
                      {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">{selectedCandidate.name}</DialogTitle>
                    <Badge 
                      style={{ backgroundColor: selectedCandidate.color }} 
                      className="text-white mb-2"
                    >
                      {selectedCandidate.party}
                    </Badge>
                    <DialogDescription className="text-base">{selectedCandidate.bio}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Education */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Educación
                  </h3>
                  <p className="text-muted-foreground">{selectedCandidate.education}</p>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Experiencia Política
                  </h3>
                  <p className="text-muted-foreground">{selectedCandidate.experience}</p>
                </div>

                {/* Proposals */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Propuestas Principales
                  </h3>
                  <ul className="space-y-2">
                    {selectedCandidate.proposals.map((proposal, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{idx + 1}</span>
                        </div>
                        <span className="text-muted-foreground">{proposal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Contacto</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedCandidate.social.website && (
                      <a 
                        href={selectedCandidate.social.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        Sitio web
                      </a>
                    )}
                    {selectedCandidate.social.email && (
                      <a 
                        href={`mailto:${selectedCandidate.social.email}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <VoteModal open={voteModalOpen} onOpenChange={setVoteModalOpen} />
    </div>
  );
}
