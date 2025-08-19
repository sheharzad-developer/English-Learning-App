#!/bin/bash

# English Learning App Deployment Script
# This script helps deploy the application using Docker Compose

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is installed and running
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Function to check if Docker Compose is installed
check_docker_compose() {
    print_status "Checking Docker Compose installation..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Function to create necessary directories
setup_directories() {
    print_status "Setting up directories..."
    mkdir -p nginx/ssl
    mkdir -p backend/media
    mkdir -p backend/staticfiles
    print_success "Directories created"
}

# Function to copy environment file
setup_environment() {
    print_status "Setting up environment variables..."
    if [ ! -f .env ]; then
        if [ -f .env.production ]; then
            cp .env.production .env
            print_warning "Copied .env.production to .env. Please review and update the values."
        else
            print_error ".env file not found. Please create one based on .env.production"
            exit 1
        fi
    fi
    print_success "Environment file is ready"
}

# Function to build and start services
deploy_services() {
    print_status "Building and starting services..."
    
    # Pull latest images
    docker-compose pull
    
    # Build custom images
    docker-compose build --no-cache
    
    # Start services
    docker-compose up -d
    
    print_success "Services started successfully"
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    docker-compose exec backend python manage.py migrate
    print_success "Database migrations completed"
}

# Function to create superuser
create_superuser() {
    print_status "Creating Django superuser..."
    print_warning "You will be prompted to create a superuser account"
    docker-compose exec backend python manage.py createsuperuser
}

# Function to collect static files
collect_static() {
    print_status "Collecting static files..."
    docker-compose exec backend python manage.py collectstatic --noinput
    print_success "Static files collected"
}

# Function to show service status
show_status() {
    print_status "Service status:"
    docker-compose ps
    
    print_status "\nService logs (last 20 lines):"
    docker-compose logs --tail=20
}

# Function to show help
show_help() {
    echo "English Learning App Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  deploy     Full deployment (build, start, migrate)"
    echo "  start      Start existing services"
    echo "  stop       Stop all services"
    echo "  restart    Restart all services"
    echo "  logs       Show service logs"
    echo "  status     Show service status"
    echo "  migrate    Run database migrations"
    echo "  superuser  Create Django superuser"
    echo "  backup     Backup database"
    echo "  restore    Restore database from backup"
    echo "  clean      Remove all containers and volumes"
    echo "  help       Show this help message"
}

# Function to backup database
backup_database() {
    print_status "Creating database backup..."
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker-compose exec db pg_dump -U postgres english_learning_db > "$BACKUP_FILE"
    print_success "Database backup created: $BACKUP_FILE"
}

# Function to restore database
restore_database() {
    if [ -z "$2" ]; then
        print_error "Please specify backup file: $0 restore <backup_file>"
        exit 1
    fi
    
    BACKUP_FILE="$2"
    if [ ! -f "$BACKUP_FILE" ]; then
        print_error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
    
    print_status "Restoring database from: $BACKUP_FILE"
    docker-compose exec -T db psql -U postgres english_learning_db < "$BACKUP_FILE"
    print_success "Database restored successfully"
}

# Function to clean up
clean_up() {
    print_warning "This will remove all containers, images, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up..."
        docker-compose down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Main script logic
case "$1" in
    deploy)
        check_docker
        check_docker_compose
        setup_directories
        setup_environment
        deploy_services
        sleep 10  # Wait for services to start
        run_migrations
        collect_static
        show_status
        print_success "Deployment completed successfully!"
        print_status "Application is available at: http://localhost"
        print_status "Admin panel is available at: http://localhost/admin"
        ;;
    start)
        docker-compose up -d
        print_success "Services started"
        ;;
    stop)
        docker-compose down
        print_success "Services stopped"
        ;;
    restart)
        docker-compose restart
        print_success "Services restarted"
        ;;
    logs)
        docker-compose logs -f
        ;;
    status)
        show_status
        ;;
    migrate)
        run_migrations
        ;;
    superuser)
        create_superuser
        ;;
    backup)
        backup_database
        ;;
    restore)
        restore_database "$@"
        ;;
    clean)
        clean_up
        ;;
    help|--help|-h)
        show_help
        ;;
    "")
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac