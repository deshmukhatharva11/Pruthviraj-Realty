"use client"

import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { Bath, Bed, Check, Heart, MapPin, Share2, MessageCircle, Phone, ArrowLeft, AlertTriangle } from "lucide-react"
import PageShell from "@/components/page-shell"
import PropertyCard from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPropertyById, getRelatedProperties } from "@/data/properties"
import { useI18n } from "@/lib/i18n"
import SiteVisitRequestForm from "@/components/site-visit-request-form"
import SafeImage from "@/components/safe-image"

const WHATSAPP_NUMBER = "917507716161"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { t } = useI18n()
  const [enquirySent, setEnquirySent] = useState(false)
  const [enquiryLoading, setEnquiryLoading] = useState(false)
  const [enquiryName, setEnquiryName] = useState("")
  const [enquiryPhone, setEnquiryPhone] = useState("")
  const [enquiryEmail, setEnquiryEmail] = useState("")
  const [enquiryMessage, setEnquiryMessage] = useState("")
  const [enquiryError, setEnquiryError] = useState("")

  const property = getPropertyById(params.id)
  if (!property) {
    return (
      <PageShell>
        <section className="container mx-auto px-4 py-20 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Property not found</p>
          <h1 className="font-serif text-3xl font-semibold text-espresso">This listing is unavailable</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">The property may have been removed or the link may be incorrect.</p>
          <Button asChild className="mt-6 bg-espresso text-white hover:bg-espresso/90">
            <Link href="/properties">Browse properties</Link>
          </Button>
        </section>
      </PageShell>
    )
  }
  const related = getRelatedProperties(property, 3)

  const waMsg = `Hi! I'm interested in "${property.title}" (${property.location}). Please share more details and arrange a site visit.`
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`
  const visitMsg = `Hi! I'd like to schedule a site visit for "${property.title}" at ${property.location}.`
  const visitUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(visitMsg)}`

  const features = property.features || []

  const amenities = property.amenities || []

  return (
    <PageShell>
      {/* Schema.org RealEstateListing Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": property.title,
            "description": property.description,
            "url": `https://pruthvirajrealty.in/properties/${property.id}`,
            "image": property.image ? [property.image] : [],
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": property.price || 0,
              "availability":
                property.status === "Available"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/SoldOut",
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": property.location,
              "addressRegion": "Maharashtra",
              "addressCountry": "IN",
            },
          }),
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-gold transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-espresso truncate max-w-48">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Demo disclaimer */}
      {property.isDemo && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="container mx-auto px-4 py-2.5 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800">{t.detail.demoNote}</p>
          </div>
        </div>
      )}

      <section className="w-full py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero image */}
              <div className={`grid gap-3 ${property.images && property.images.length > 1 ? "grid-cols-1 md:grid-cols-[1.7fr_1fr]" : "grid-cols-1"}`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <SafeImage
                    src={property.image || "/placeholder.jpg"}
                    alt={`Illustrative photo for demo listing: ${property.title}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 67vw"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-espresso/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ivory">{property.transaction}</span>
                    <span className="bg-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-espresso">{property.status}</span>
                  </div>
                </div>
                {property.images && property.images.length > 1 && (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                    {property.images.slice(1, 3).map((image, index) => (
                      <div key={`${image}-${index}`} className="relative aspect-[16/10] overflow-hidden bg-muted md:aspect-auto md:min-h-0">
                        <SafeImage src={image} alt={`Additional illustrative view ${index + 1} of ${property.title}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 30vw" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & actions */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-2">
                    {property.category}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-serif font-semibold text-espresso leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label={t.detail.addToFavorites}
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-gold hover:text-gold transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button
                    aria-label={t.detail.share}
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-gold hover:text-gold transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Key specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border border-border bg-white">
                <SpecBox label="Area" value={property.area} />
                {property.beds !== undefined && (
                  <SpecBox label={t.property.beds} value={String(property.beds)} />
                )}
                {property.baths !== undefined && (
                  <SpecBox label={t.property.baths} value={String(property.baths)} />
                )}
                {property.roadAccess && (
                  <SpecBox label={t.detail.roadAccess} value={property.roadAccess} />
                )}
                {property.possession && (
                  <SpecBox label={t.detail.possession} value={property.possession} />
                )}
                {property.developer && (
                  <SpecBox label="Developer" value={property.developer} />
                )}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3 rounded-none bg-muted h-auto p-0">
                  <TabsTrigger value="description" className="rounded-none py-3 text-sm data-[state=active]:bg-espresso data-[state=active]:text-white">
                    {t.detail.description}
                  </TabsTrigger>
                  <TabsTrigger value="features" className="rounded-none py-3 text-sm data-[state=active]:bg-espresso data-[state=active]:text-white">
                    {t.detail.features}
                  </TabsTrigger>
                  <TabsTrigger value="location" className="rounded-none py-3 text-sm data-[state=active]:bg-espresso data-[state=active]:text-white">
                    {t.detail.location}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="p-5 border border-t-0 border-border bg-white mt-0">
                  <p className="text-sm leading-relaxed text-espresso/80">{property.description}</p>
                </TabsContent>

                <TabsContent value="features" className="p-5 border border-t-0 border-border bg-white mt-0">
                  {features.length > 0 && (
                    <>
                      <h3 className="text-sm font-semibold text-espresso mb-3">Features</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-espresso/80">
                            <Check className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {amenities.length > 0 && (
                    <>
                      <h3 className="text-sm font-semibold text-espresso mb-3 mt-2">Amenities</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {amenities.map((a) => (
                          <li key={a} className="flex items-center gap-2 text-sm text-espresso/80">
                            <Check className="h-3.5 w-3.5 text-bronze flex-shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {features.length === 0 && amenities.length === 0 && (
                    <p className="text-sm text-muted-foreground">Feature details will be added for this listing.</p>
                  )}
                </TabsContent>

                <TabsContent value="location" className="p-5 border border-t-0 border-border bg-white mt-0">
                  <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-border bg-muted p-8 text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-espresso">{property.location}</p>
                    <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
                      This opens a general area search, not an exact property pin. Confirm the property location and access independently.
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-bronze underline underline-offset-4 hover:text-espresso"
                    >
                      Explore the approximate area on Google Maps
                    </a>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Back button */}
              <Button asChild variant="outline" className="rounded-none border-espresso text-espresso hover:bg-espresso hover:text-white gap-2">
                <Link href="/properties">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Properties
                </Link>
              </Button>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Price card */}
              <div className="border border-border bg-white p-6">
                <div className="flex items-baseline justify-between mb-1">
                  <div>
                    {property.priceOnRequest ? (
                      <p className="text-sm font-medium text-bronze italic">{t.property.priceOnRequest}</p>
                    ) : (
                      <p className="text-2xl font-serif font-semibold text-espresso">{property.priceDisplay}</p>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gold tracking-wide uppercase">{property.category}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-5">{property.area}</p>

                <div className="space-y-3">
                  <SiteVisitRequestForm
                    propertyId={property.id}
                    propertyTitle={property.title}
                    trigger={
                      <button className="flex items-center justify-center gap-2 w-full py-3 bg-espresso text-white hover:bg-espresso/90 transition-colors text-sm font-medium tracking-wide">
                        {t.detail.scheduleTour}
                      </button>
                    }
                  />
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors text-sm font-medium"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t.property.whatsapp}
                  </a>
                  <a
                    href="tel:+917507716161"
                    className="flex items-center justify-center gap-2 w-full py-3 border border-espresso text-espresso hover:bg-espresso hover:text-white transition-colors text-sm font-medium"
                  >
                    <Phone className="h-4 w-4" />
                    {t.property.call}
                  </a>
                </div>
              </div>

              {/* Enquiry form */}
              <div className="border border-border bg-white p-6">
                <h3 className="font-serif text-base font-semibold text-espresso mb-4">{t.detail.contactAgent}</h3>

                {/* Agent */}
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-serif font-semibold text-gold">PR</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-espresso">{t.detail.agentName}</p>
                    <p className="text-xs text-muted-foreground">{t.detail.agentTitle}</p>
                  </div>
                </div>

                {/* Form */}
                {enquirySent ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 text-center rounded-sm">
                    <Check className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-espresso mb-1">Enquiry Transmitted</p>
                    <p className="text-[11px] text-muted-foreground mb-3">
                      Thank you! Our property consultant has received your inquiry for this listing and will contact you shortly.
                    </p>
                    <Button
                      onClick={() => setEnquirySent(false)}
                      variant="outline"
                      size="sm"
                      className="text-[10px] h-7"
                    >
                      Send Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      if (!enquiryPhone || !enquiryName) return
                      setEnquiryLoading(true)
                      setEnquiryError("")
                      try {
                        const response = await fetch("/api/leads", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            type: "Property Enquiry",
                            name: enquiryName || "Prospective Buyer",
                            phone: enquiryPhone,
                            email: enquiryEmail || undefined,
                            propertyId: property.id,
                            propertyTitle: property.title,
                            propertyCategory: property.category,
                            location: property.location,
                            notes: enquiryMessage || `Interested in ${property.title}`,
                            source: "Property Detail Page",
                          }),
                        })
                        if (!response.ok) throw new Error("The enquiry could not be submitted. Please try again or contact us directly.")
                        setEnquirySent(true)
                      } catch (error) {
                        setEnquiryError(error instanceof Error ? error.message : "The enquiry could not be submitted. Please try again or contact us directly.")
                      } finally {
                        setEnquiryLoading(false)
                      }
                    }}
                    className="space-y-3"
                  >
                    {enquiryError && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-xs text-red-800">{enquiryError}</p>}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-espresso/70" htmlFor="enquiry-name">{t.detail.name} *</label>
                      <Input
                        required
                        id="enquiry-name"
                        placeholder={t.detail.yourName}
                        value={enquiryName}
                        onChange={(e) => setEnquiryName(e.target.value)}
                        className="rounded-none border-input text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-espresso/70" htmlFor="enquiry-phone">{t.detail.yourPhone} *</label>
                      <Input
                        required
                        id="enquiry-phone"
                        type="tel"
                        placeholder="+91 98220 00000"
                        value={enquiryPhone}
                        onChange={(e) => setEnquiryPhone(e.target.value)}
                        className="rounded-none border-input text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-espresso/70" htmlFor="enquiry-email">Email</label>
                      <Input
                        id="enquiry-email"
                        type="email"
                        placeholder={t.detail.yourEmail}
                        value={enquiryEmail}
                        onChange={(e) => setEnquiryEmail(e.target.value)}
                        className="rounded-none border-input text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-espresso/70" htmlFor="enquiry-message">
                        {t.detail.message}
                      </label>
                      <textarea
                        id="enquiry-message"
                        rows={3}
                        value={enquiryMessage}
                        onChange={(e) => setEnquiryMessage(e.target.value)}
                        placeholder={`I'd like to schedule a visit for ${property.title}...`}
                        className="w-full rounded-none border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={enquiryLoading}
                      className="w-full bg-gold text-espresso hover:bg-bronze hover:text-white rounded-none font-medium tracking-wide text-xs"
                    >
                      {enquiryLoading ? "Submitting..." : t.detail.sendMessage}
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                      By submitting, you agree to be contacted by Pruthviraj Realty regarding this property.
                    </p>
                  </form>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related properties */}
      {related.length > 0 && (
        <section className="w-full py-12 bg-ivory">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-serif font-semibold text-espresso mb-6">{t.detail.similar}</h2>
            <div className="grid property-card-grid gap-5">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  )
}

function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 border border-border text-center">
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <span className="text-sm font-semibold text-espresso leading-tight">{value}</span>
    </div>
  )
}

function LabeledInput({
  id, label, placeholder, type = "text"
}: {
  id: string; label: string; placeholder: string; type?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-espresso/70" htmlFor={id}>{label}</label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="rounded-none border-input text-sm h-9 focus-visible:ring-gold focus-visible:ring-1"
      />
    </div>
  )
}
