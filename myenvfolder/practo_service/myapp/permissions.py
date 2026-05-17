from rest_framework.permissions import BasePermission


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            str(request.user.role).upper() == "PATIENT"
        )


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            str(request.user.role).upper() == "DOCTOR"
        )


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            str(request.user.role).upper() == "ADMIN"
        )


class IsDoctorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            str(request.user.role).upper() in ["DOCTOR", "ADMIN"]
        )


class IsPatientOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            str(request.user.role).upper() in ["PATIENT", "ADMIN"]
        )