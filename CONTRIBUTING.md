# 🤝 Contributing to EverAid

Thank you for your interest in contributing to EverAid! This document provides guidelines and information for contributors.

## 🎯 Project Mission

EverAid is an open-source emergency AI assistant built for the OpenAI OSS Hackathon. Our goal is to create a tool that can save lives by providing clear, actionable guidance in crisis situations - whether online or offline.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Basic knowledge of React/React Native

### Setup Development Environment
```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/EverAid.git
cd EverAid

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run start
```

## 📋 Contribution Guidelines

### What We're Looking For
- **Bug fixes** - Help us make EverAid more reliable
- **Feature improvements** - Enhance user experience and functionality
- **Documentation** - Make EverAid easier to understand and use
- **Testing** - Help ensure quality and reliability
- **Localization** - Add support for more languages
- **Accessibility** - Make EverAid usable by everyone

### What We're NOT Looking For
- **Medical advice changes** without professional review
- **Security-related changes** without proper discussion
- **Breaking changes** without thorough testing
- **Dependencies** that significantly increase bundle size

## 🔧 Development Workflow

### 1. Issue Discussion
- Check existing issues first
- Create a new issue if needed
- Discuss your approach before coding
- Get feedback on design decisions

### 2. Branch Strategy
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 3. Development Standards
- Follow existing code style and patterns
- Write clear commit messages
- Test your changes thoroughly
- Update documentation if needed

### 4. Testing Requirements
```bash
# Run basic tests
npm run test

# Test AI integration
npm run test:ai

# Test offline functionality
npm run test:offline
```

## 📝 Code Style Guide

### React/React Native
- Use functional components with hooks
- Prefer TypeScript for new code
- Follow React best practices
- Use meaningful component names

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Maintain dark theme consistency
- Ensure high contrast for accessibility

### File Organization
```
components/
  ComponentName/
    index.tsx          # Main component
    ComponentName.test.tsx  # Tests
    types.ts           # TypeScript types
    styles.ts          # Custom styles (if needed)
```

## 🧪 Testing Guidelines

### Unit Tests
- Test all new functions and components
- Mock external dependencies
- Test edge cases and error conditions
- Maintain good test coverage

### Integration Tests
- Test AI integration thoroughly
- Validate offline functionality
- Test cross-platform compatibility
- Verify emergency pack creation

### Manual Testing
- Test on both iOS and Android
- Verify offline behavior
- Test emergency scenarios
- Check accessibility features

## 📚 Documentation Standards

### Code Comments
- Explain complex logic
- Document API interfaces
- Include usage examples
- Keep comments up-to-date

### README Updates
- Update installation instructions
- Document new features
- Include screenshots for UI changes
- Update environment variables

### API Documentation
- Document new endpoints
- Include request/response examples
- Document error codes
- Update integration guides

## 🔒 Security Considerations

### Data Privacy
- Never log sensitive user information
- Use secure storage methods
- Follow privacy best practices
- Document data handling

### API Security
- Validate all inputs
- Sanitize user content
- Use secure authentication
- Follow OWASP guidelines

## 🚨 Emergency Content Guidelines

### Medical Information
- All health content must be reviewed
- Include appropriate disclaimers
- Prioritize user safety
- Provide clear escalation paths

### Safety First
- Test emergency procedures
- Validate step sequences
- Include safety warnings
- Document limitations

## 📦 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No breaking changes
- [ ] Security review completed

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Test improvement

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors
```

## 🏷️ Release Process

### Versioning
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Update CHANGELOG.md
- Tag releases in GitHub
- Update package.json versions

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes written
- [ ] Assets attached

## 🆘 Getting Help

### Communication Channels
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Requests** - Code reviews and feedback

### Resources
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🙏 Recognition

### Contributors
- All contributors will be listed in README.md
- Significant contributions get special recognition
- Regular contributors may be invited as maintainers

### Code of Conduct
- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Report inappropriate behavior

## 📄 License

By contributing to EverAid, you agree that your contributions will be licensed under the same license as the project (Apache License 2.0).

---

**Thank you for helping make EverAid better for everyone! 🚨❤️**

*Together we can build tools that save lives.*
