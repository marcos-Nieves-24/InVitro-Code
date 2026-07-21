# Slides: Data Distribution

## Slide 1: Title
- Data Distribution: Seeing the Shape of Data
- Module 3, Lesson 2

## Slide 2: Learning Objectives
- Build histograms and density plots
- Interpret skewness and kurtosis
- Choose appropriate bin widths

## Slide 3: Why Distribution Matters
- Two datasets can have same mean/sd but very different shapes
- Distribution affects choice of summary statistics and ML models

## Slide 4: Histograms
- Partition data into bins
- Count observations per bin
- Bin width dramatically changes interpretation

## Slide 5: Choosing Bins
- Sturges rule: k = ceil(log2(n) + 1)
- Square-root rule: k = ceil(sqrt(n))
- Freedman-Diaconis: bin width = 2 × IQR × n^(-1/3)

## Slide 6: Density Plots (KDE)
- Smooth estimate of probability density
- Kernel + bandwidth control smoothness
- Useful for comparing distributions

## Slide 7: Skewness
- Measures asymmetry
- Zero = symmetric
- Positive = right tail (mean > median)
- Negative = left tail (mean < median)

## Slide 8: Kurtosis
- Measures tail heaviness
- Zero = normal-like (mesokurtic)
- Positive = heavy tails (leptokurtic)
- Negative = light tails (platykurtic)

## Slide 9: Log Transformation
- Right-skewed data often becomes normal after log transform
- Common in gene expression, income, prices

## Slide 10: Key Takeaways
- Always visualize distributions
- Report skewness and kurtosis alongside mean/std
- Transform skewed data when needed
