import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vote, BarChart3, Users, TrendingUp, Calendar, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Proceso Electoral 2025</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Tu Voto Construye el Futuro
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Participa en el proceso electoral de manera <strong className="text-foreground">segura</strong>,
              <strong className="text-foreground"> transparente</strong> y <strong className="text-foreground">accesible</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                onClick={() => navigate("/vote")}
                className="gradient-hero text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
              >
                <Vote className="mr-2 h-5 w-5" />
                Emitir mi Voto
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/results")}
                className="border-border hover:bg-muted"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Ver Resultados
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-border shadow-sm hover:shadow-elegant transition-smooth group">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-glow transition-smooth">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Seguridad Garantizada</h3>
              <p className="text-sm text-muted-foreground">Encriptación de extremo a extremo para proteger tu voto</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-elegant transition-smooth group">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-glow transition-smooth">
                <BarChart3 className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Resultados en Tiempo Real</h3>
              <p className="text-sm text-muted-foreground">Transparencia total del proceso electoral</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-elegant transition-smooth group">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-glow transition-smooth">
                <Users className="h-7 w-7 text-secondary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Acceso Universal</h3>
              <p className="text-sm text-muted-foreground">Sin barreras ni restricciones para todos los ciudadanos</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Active Elections */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Elecciones Activas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Elección Presidencial 2025</CardTitle>
                <Badge className="bg-primary text-primary-foreground">En curso</Badge>
              </div>
              <CardDescription>Elige al próximo presidente del país</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inicio:</span>
                  <span className="font-medium">15 Nov 2025 - 08:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cierre:</span>
                  <span className="font-medium">15 Nov 2025 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Candidatos:</span>
                  <span className="font-medium">4</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm opacity-60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Elección Regional</CardTitle>
                <Badge variant="secondary">Cerrada</Badge>
              </div>
              <CardDescription>Elección de autoridades regionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inicio:</span>
                  <span className="font-medium">10 Oct 2025 - 08:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cierre:</span>
                  <span className="font-medium">10 Oct 2025 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Candidatos:</span>
                  <span className="font-medium">6</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Elección Distrital</CardTitle>
                <Badge className="bg-primary text-primary-foreground">En curso</Badge>
              </div>
              <CardDescription>Elección de autoridades distritales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inicio:</span>
                  <span className="font-medium">15 Nov 2025 - 08:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cierre:</span>
                  <span className="font-medium">15 Nov 2025 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Candidatos:</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}
