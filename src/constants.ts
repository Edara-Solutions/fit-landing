import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'predator-pre-workout',
    name: 'Predator Pre-Workout',
    price: 49.99,
    category: 'pre-workout',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEpMMrgcbBsyCAqFNAc0OfU4OvIUFi_at8veCNVgA7FL9BCOSHwUstK3njVutE1idaEuwFyoIOKdLOpPS33LK2PSkEaJYXJrlKXIMfduR2vm6RPEl_rZfZ8mSNhk-vjmM2xQWbDl3hTJR0Gj0U5jOcv_imL4ZZ4ZrdLb-_5TJeZ93SmnzbfXkGEl4TPk3QhB29vwPt0dXTig9pDg43fYZAvTzdlLSpJFkPWTyqqwInMh56kHfeih72Cz3QkglZOCHM2eMJAkSi9Io',
    description: 'Explosive energy. Razor-sharp focus. Skin-tearing pumps. Formulated for elite athletes who demand maximum performance from every session.',
    isBestSeller: true,
    flavors: ['Blood Orange', 'Blue Raspberry', 'Green Apple'],
    servings: [30, 60],
    ingredients: [
      { name: 'L-Citrulline Malate 2:1', amount: '6000mg' },
      { name: 'Beta-Alanine', amount: '3200mg' },
      { name: 'Caffeine Anhydrous', amount: '300mg' },
      { name: 'Alpha-GPC 50%', amount: '300mg' },
      { name: 'L-Tyrosine', amount: '1000mg' }
    ]
  },
  {
    id: 'alpha-whey-protein',
    name: 'Alpha Whey Protein',
    price: 64.99,
    category: 'protein',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQE-IshNZygpR91xTQrYo2GNN6LTT6NSRZF_4e1Wn0xFGwJ01ZTJdZkydT_7njWhn2lUOgYyWYO-Yub5u0s7bf1wp3gzLDqkSSUppRM-A5EC09OVdzQq0uV52Zr3eQ6YC9unRYUzF25eHhOIPW8hJr41mYqkvhJar7KkwAbKpTm0U56dE9P9mSyBUxYs9-X1K5RGyro47KzgAbH2ExpMic_3yFdpChvA7MfQU7wXYOet8KPZ1Cdc3sFzS8LJxTA28hjiRs-K8BAUU',
    description: 'Premium whey protein isolate for explosive muscle growth and rapid recovery.',
    flavors: ['Rich Chocolate', 'Vanilla Bean', 'Cookies & Cream']
  },
  {
    id: 'recovery-bcaa',
    name: 'Recovery BCAA',
    price: 34.99,
    category: 'recovery',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6hDCj1Liz_3r9q2sTcAJYe1RIIXGQr1lHHqiSpSPjVjFu7n2ilB4sFq2Q15zhK7K7g3skqZLR6hRqPUOFo102fMjur1wYEe02Vvj_1lmBCESiaT2hgsd2A1jFPtTGpvEwboqVavLXB-u7n2ny5ia7tq-ehvdKTL1kPF2Jhh8WBgAlbdE0uJiK_FB0FU9K3NJxpTrlDFQAGAifb2hmQTIobBCz59I3nleqAOnNod0AaBzVj--oGeImAN5WHPQ-Uie0-_ntSx4xVtg',
    description: 'Enhance recovery and reduce muscle soreness with our precision-blended BCAA formula.',
    isSoldOut: true
  },
  {
    id: 'ignition-pre-workout',
    name: 'Ignition Pre-Workout',
    price: 39.99,
    originalPrice: 49.99,
    category: 'pre-workout',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSneAKManNT6UqRlV53uz_xwnsFqB1HF-GwHneaWaSiMeMlLh1HVQ8WyPGwUbYy7rmKzzXcIudga9rXxxHaH2Z3rXeHfmSyLFDUZTNlFEUpwAcW1MpedxjZ7lIaQxbNo0kU59leGWSrAOu8Kd5zk0LsMrWUw7PpQlqMnCwtO_D7HvMRQJnDeWBhUp_Om-wtOTyiZ18Xh2L61OARBe2bGQ2_71COxW0GFDNLyhAa6ZBJnGdwUF4ya0k1SuLVlmGEr0xSZho6gtLsnQ',
    description: 'High-octane fuel to ignite your training sessions.',
    isSale: true
  },
  {
    id: 'surge-bcaa-recovery',
    name: 'Surge BCAA Recovery',
    price: 29.99,
    category: 'recovery',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1v0rZKadYOQ7QH4NH8GKVh5ihsd325YECHw8v2dvQhmJrInf79v7yAPy3IcllaI2-NaAMQsIn-igUP9ZF0faEZqK5OB_7tfE-zwlti6xqMD2N62uY_o1rMPeGgOfEyO0i0wQF93qwq8H0RSKGesARaXThiiiN-7f8V9u1Xtx0mL9QtmWPlZRHnrNJmTPBFND2R528DBunn9BPe05QoOeX3ZcPfWgQTZCDfRiQS53QET3L8ATW4Qx8qsc8FpCNltk5jlK98S8ytI0',
    description: 'Pure amino power for the relentless athlete.'
  },
  {
    id: 'ultimate-bulk-stack',
    name: 'Ultimate Bulk Stack',
    price: 149.99,
    category: 'stacks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBC4kwkSP-46T2sO0QJAugPeCVcJyF17enFFRPGISz_Odc5jdUErP3xidTcJ3nQM4lYrH8A8UHa2VBc1CByhsQx1p2xNa63XIyjmfS4amVlXycpmTxc2VPD-UecmRVhIjoe-AGGii41MEr18x4bJG35z8c4LRyfgJor9PMN1WmDUuIuEqgWjA6dOQJ8t7ey8jIeoC5m7LegkcowThZFKe4v12OES4It8XtJAlX7doIQUXVzL_Nx9yCElmWqsQYJSQclNIeArVpaK8',
    description: 'Complete mass-building system for those who refuse to stay small.',
    isBestSeller: true,
    includedItems: ['Predator Pre-Workout', 'Alpha Whey', 'Mass Builder XL']
  },
  {
    id: 'shred-define-stack',
    name: 'Shred & Define Stack',
    price: 119.99,
    category: 'stacks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcOgki3ubZJ4dA63TnF644wJthcM0UPXyr3wwMLPTA6Xs2qm0NW5p2EzBXVxdVlvIYXxcbYbVPzFAxwTYXcShl7YDuXg2Soen5MzmxyGYiO74gILLDGg3ywQsXud6LhhVKvgnYD_j4ntuKnXknpgsteFnmyC7edxGoF0dG3CicUBs5j7jWvIXfpjvStcO_aBntPhJLDNkAwFtvRw15ALEIOf08FG4_nm9g9DCXnfdFTlDp7Bm47s5ZuMOKRYoTK9os4dd412v9CW8',
    description: 'Incinerate fat while preserving hard-earned muscle.',
    includedItems: ['Ignition Pre-Workout', 'Hydrate Pro', 'Surge BCAA']
  },
  {
    id: 'recovery-essentials',
    name: 'Recovery Essentials',
    price: 79.99,
    category: 'stacks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFm1O2Kgrs-ycpWr0SRYOv5lfLc5MmKD3ZUQZnP_iv9XcId6oCPm6_o-bpb7Fn5eof7Cjb0IsteKxNR9rovM_SC6JbAAWJKfBY-XX5_cV1TmdDE31JYTJOyHf7ng8jH10zzcAueitfijJ0TIYWVh3LFcd1P_cL40jmLgmkKSdV61vFL5qzPQzLcmpVOpFA6_BGbFzehf_uC-WEl__DrVuyVQzmVXqob2kf4ssbIqw0qXhUgT-IQY8gUC3frvh3GqZUDhTy-Kn2q9k',
    description: 'The foundation of growth is recovery. Don’t neglect it.',
    includedItems: ['Recovery BCAA', 'Deep Sleep Formula', 'Tactical Shaker']
  },
  {
    id: 'performance-bundle',
    name: 'Performance Bundle',
    price: 134.99,
    category: 'stacks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8Bvnza7PKns1MSaga_w0JNrKZI461crGpP0ts2sGZ_rSJWB0y_p2_fNIRu2qGdiKAXK7MJq6tF1nD1s6wsZzGA_cjV8QqDuXrEz5jIdFK1it9GhB-IvGsDfH-TqDrcXaV3hMGJP3nL-fumsNDyxai4qvJYYfe4U0cPtvTuNjqTVoiVdF7YkgOpCeaQ0Cu_w-XJaLV8co2fzWLERK7ik7UqH5lhkImic4mm7UmG8oW9CBjqsfapFA7NpWlZbt5E0PYwvYLWTy0nvE',
    description: 'Elite level performance for the dedicated athlete.',
    includedItems: ['Surge Pre-Workout', 'Pure Creatine', 'Alpha Whey']
  }
];
