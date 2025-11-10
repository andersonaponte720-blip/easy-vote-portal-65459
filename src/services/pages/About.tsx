import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Shield, Lock, BarChart3, Vote, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3">
            <Info className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Acerca del Sistema</h1>
          </div>
          <p className="text-lg text-muted-foreground">Sistema Electoral Digital Transparente y Seguro</p>
        </div>

        {/* Mission */}
        <Card className="border-border shadow-elegant animate-fade-in-up">
          <CardHeader className="gradient-hero border-b">
            <CardTitle className="text-2xl text-primary-foreground flex items-center gap-2">
              <Vote className="h-6 w-6" />
              Nuestra Misión
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground leading-relaxed">
              Facilitar el proceso electoral mediante una plataforma digital moderna, segura y accesible para todos los ciudadanos. 
              Nuestro objetivo es garantizar la transparencia, integridad y confidencialidad de cada voto, 
              fortaleciendo así la democracia y la participación ciudadana.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border shadow-sm hover:shadow-elegant transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 gradient-hero rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Seguridad Máxima</h3>
                  <p className="text-sm text-muted-foreground">
                    Implementamos encriptación de extremo a extremo y múltiples capas de seguridad 
                    para proteger la integridad de cada voto.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-elegant transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Lock className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Privacidad Garantizada</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu voto es completamente anónimo. Nadie puede rastrear ni identificar 
                    tu elección individual.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-elegant transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <BarChart3 className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Transparencia Total</h3>
                  <p className="text-sm text-muted-foreground">
                    Resultados en tiempo real disponibles públicamente. Cada voto es verificable 
                    sin comprometer el anonimato.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-elegant transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Fácil de Usar</h3>
                  <p className="text-sm text-muted-foreground">
                    Interfaz intuitiva y accesible diseñada para que cualquier ciudadano 
                    pueda votar sin dificultad.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <Card className="border-border shadow-elegant">
          <CardHeader className="gradient-hero border-b">
            <CardTitle className="text-2xl text-primary-foreground">¿Cómo Funciona?</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-sm font-bold text-primary-foreground">1</span>
                <div>
                  <h4 className="font-semibold text-foreground">Registro de Datos</h4>
                  <p className="text-sm text-muted-foreground">Complete el formulario con su información personal y ubicación.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-sm font-bold text-primary-foreground">2</span>
                <div>
                  <h4 className="font-semibold text-foreground">Selección de Candidato</h4>
                  <p className="text-sm text-muted-foreground">Revise las propuestas y elija su candidato preferido.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-sm font-bold text-primary-foreground">3</span>
                <div>
                  <h4 className="font-semibold text-foreground">Confirmación Segura</h4>
                  <p className="text-sm text-muted-foreground">Su voto se encripta y registra de forma segura e irreversible.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-sm font-bold text-primary-foreground">4</span>
                <div>
                  <h4 className="font-semibold text-foreground">Resultados en Tiempo Real</h4>
                  <p className="text-sm text-muted-foreground">Consulte los resultados actualizados instantáneamente.</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">¿Preguntas o dudas sobre el sistema?</p>
            <p className="text-sm text-muted-foreground">
              Contáctenos en: <a href="mailto:soporte@sistemaelectoral.pe" className="text-primary hover:underline">soporte@sistemaelectoral.pe</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
