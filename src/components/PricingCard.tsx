import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Crown } from 'lucide-react'

interface PricingCardProps {
  title: string
  price: number
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
  onButtonClick: () => void
  icon?: React.ReactNode
}

export function PricingCard({
  title,
  price,
  description,
  features,
  popular,
  buttonText,
  onButtonClick,
  icon
}: PricingCardProps) {
  return (
    <Card className={`relative ${popular ? 'border-primary shadow-lg scale-105' : 'border-gray-200'}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-white px-3 py-1">
            <Star className="h-3 w-3 mr-1" />
            Алдартай
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          {icon || <Crown className="h-8 w-8 text-purple-600" />}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price.toLocaleString('mn-MN')}</span>
          <span className="text-gray-500 ml-2">₮/сар</span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className={`w-full ${popular ? 'bg-primary hover:bg-primary/90' : ''}`}
          variant={popular ? 'default' : 'outline'}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}