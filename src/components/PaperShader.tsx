import { Dithering } from '@paper-design/shaders-react'

export function PaperShader({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Dithering
        style={{ width: '100%', height: '100%' }}
        colorBack="#0e1116"
        colorFront="#4f9dff"
        shape="warp"
        type="4x4"
        pxSize={2}
        scale={1}
        speed={0.2}
      />
    </div>
  )
}
