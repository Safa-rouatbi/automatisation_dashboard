*** Settings ***
Documentation    Robot pour simuler plusieurs exécutions réalistes de tâches automatiques
Library          BuiltIn
Library          Collections
Library          OperatingSystem
Library          random
Library          DateTime
Library          JSONLibrary

*** Variables ***
@{TASKS}         backup    analyse    upload
${LOG_FILE}      backend/data/logs.json
${ITERATIONS}    5    # nombre d'exécutions par tâche

*** Test Cases ***
Simuler Plusieurs Exécutions Réalistes
    Log To Console    === Début de la simulation réaliste ===
    ${all_results}=    Create List

    # Charger les anciens logs (s'il existe)
    ${exists}=    Run Keyword And Return Status    File Should Exist    ${LOG_FILE}
    IF    ${exists}
        ${all_results}=    Load Json From File    ${LOG_FILE}
    END

    FOR    ${task}    IN    @{TASKS}
        Log To Console    ---- Simulation pour la tâche ${task} ----
        FOR    ${i}    IN RANGE    ${ITERATIONS}
            ${duration}=    Evaluate    random.randint(1, 3)    modules=random
            Sleep    ${duration}s
            ${success}=    Evaluate    random.choice([True, False])    modules=random
            ${status}=    Set Variable If    ${success}    réussi    échoué
            ${timestamp}=    Get Current Date    result_format=%Y-%m-%d %H:%M:%S
            ${entry}=    Create Dictionary
            ...    task=${task}
            ...    duration=${duration}
            ...    success=${success}
            ...    timestamp=${timestamp}
            Append To List    ${all_results}    ${entry}
            Log To Console    ${task} #${i} : ${status} (${duration}s)
        END
    END

    ${json}=    Evaluate    __import__('json').dumps(${all_results}, indent=4)
    Create File    ${LOG_FILE}    ${json}
    Log To Console    === Résultats enregistrés dans ${LOG_FILE} ===
    Log To Console    === Fin de la simulation ===
